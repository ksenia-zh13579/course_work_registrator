import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
import styles from './Incidents.module.scss';

export default function Incidents() {
  const { isAdmin, isAuthenticated } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [tab, setTab] = useState('reviewed');
  const [startDate, setStartDate] = useState('01.04.2026');
  const [endDate, setEndDate] = useState('01.05.2026');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: '',
    date: '',
    description: '',
    status: '',
  });

  useEffect(() => {
    loadIncidents();
  }, [tab, startDate, endDate]);

  const loadIncidents = async () => {
    try {
      const res = await api.getIncidents(startDate, endDate);
      const filtered = res.data.filter(inc => {
        if (tab === 'reviewed') return inc.status === 'Рассмотрено' || inc.status === 'reviewed';
        return inc.status === 'На рассмотрении' || inc.status === 'pending';
      });
      setIncidents(filtered);
    } catch (err) {
      console.error('Error loading incidents:', err);
    }
  };

  const handleOpenModal = (incident = null) => {
    if (incident) {
      setEditingId(incident.id);
      setFormData({
        type: incident.type || '',
        date: incident.date || '',
        description: incident.description || '',
        status: incident.status || '',
      });
    } else {
      setEditingId(null);
      setFormData({ type: '', date: '', description: '', status: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.redactIncident(editingId, formData);
      } else {
        await api.postIncident(formData);
      }
      setShowModal(false);
      await loadIncidents();
    } catch (err) {
      console.error('Error saving incident:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить происшествие?')) {
      try {
        await api.deleteIncident(id);
        await loadIncidents();
      } catch (err) {
        console.error('Error deleting incident:', err);
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Список происшествий</h1>

      <div className={styles.tabsBar}>
        <button
          className={`btn-tab${tab === 'pending' ? ' btn-tab--active' : ' btn-tab--inactive'}`}
          onClick={() => setTab('pending')}
        >
          На рассмотрении
        </button>
        <button
          className={`btn-tab${tab === 'reviewed' ? ' btn-tab--active' : ' btn-tab--inactive'}`}
          onClick={() => setTab('reviewed')}
        >
          Рассмотренные
        </button>
      </div>

      <div className="page-header-row">
        <span className="page-header-label">Показывать результаты, начиная с</span>
        <input
          type="text"
          className="date-filter-select"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="page-header-label">по</span>
        <input
          type="text"
          className="date-filter-select"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {(isAdmin || isAuthenticated) && (
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Добавить новое происшествие
        </button>
      )}

      <div className="data-table">
        <div className="table-head-row">
          <div className="table-cell table-cell--head table-cell--id">ID Происшествия</div>
          <div className="table-cell table-cell--head">Тип происшествия</div>
          <div className="table-cell table-cell--head">Описание</div>
          <div className="table-cell table-cell--head">Дата</div>
          <div className="table-cell table-cell--head">Статус</div>
        </div>

        {incidents.map(incident => (
          <div key={incident.id} className="table-row">
            <div className="table-cell table-cell--id">
              <span>{incident.id}</span>
              {(isAdmin || isAuthenticated) && (
                <>
                  <button
                    className="text-link"
                    onClick={() => handleOpenModal(incident)}
                  >
                    Редактировать
                  </button>
                  {isAdmin && (
                    <button
                      className="text-link"
                      style={{ color: '#e74c3c' }}
                      onClick={() => handleDelete(incident.id)}
                    >
                      Удалить
                    </button>
                  )}
                </>
              )}
            </div>
            <div className="table-cell">{incident.type}</div>
            <div className="table-cell">{incident.description}</div>
            <div className="table-cell">{incident.date}</div>
            <div className="table-cell">{incident.status}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editingId ? 'Редактировать происшествие' : 'Добавить новое происшествие'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <label className="form-label">Тип происшествия:</label>
          <select
            className="form-select"
            name="type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            required
          >
            <option value="">Выберите тип</option>
            <option value="ДТП">ДТП</option>
            <option value="Кража">Кража</option>
            <option value="Драка">Драка</option>
          </select>

          <label className="form-label">Дата:</label>
          <input
            className="form-input"
            type="text"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            placeholder="01.01.2026"
          />

          <label className="form-label">Описание:</label>
          <input
            className="form-input"
            type="text"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Описание происшествия"
          />

          {isAdmin && (
            <>
              <label className="form-label">Статус:</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Выберите статус</option>
                <option value="На рассмотрении">На рассмотрении</option>
                <option value="Рассмотрено">Рассмотрено</option>
              </select>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
