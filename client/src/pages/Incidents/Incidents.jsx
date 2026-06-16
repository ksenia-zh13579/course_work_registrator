import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
import styles from './Incidents.module.scss';

export default function Incidents() {
  function formatDate(date) {
    let toDate = new Date(date);

    const year = toDate.getFullYear();
    const month = String(toDate.getMonth() + 1).padStart(2, '0');
    const day = String(toDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const { isAdmin, isAuthenticated } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [incidentStatuses, setIncidentStatuses] = useState([]);
  const [tab, setTab] = useState('reviewed');
  const [startDate, setStartDate] = useState('1900-01-01');
  const [endDate, setEndDate] = useState('2026-06-16');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    incident_type_id: '',
    date: '',
    description: '',
    incident_status_id: '',
  });


  const loadIncidentTypes = async () => {
    try {
      const res = await api.getIncidentTypes();
      setIncidentTypes(res.data);
    } catch (err) {
      console.error('Error loading incident types:', err);
    }
  };

  const loadIncidentStatuses = async () => {
    try {
      const res = await api.getIncidentStatuses();
      setIncidentStatuses(res.data);
    } catch (err) {
      console.error('Error loading incident statuses:', err);
    }
  };

  const loadIncidents = async () => {
    try {
      const res = await api.getIncidents(startDate, endDate);
      const incidents = res.data;
      const filtered = incidents.filter(inc => {
        if (tab === 'reviewed') return inc.incident_status !== 'На рассмотрении';
        return inc.incident_status === 'На рассмотрении';
      });
      setIncidents(filtered);
    } catch (err) {
      console.error('Error loading incidents:', err);
    }
  };

  useEffect(() => {
    loadIncidents();
    loadIncidentTypes();
    loadIncidentStatuses();
  }, [tab, startDate, endDate]);

  const handleOpenModal = (incident = null) => {
    if (incident) {
      setEditingId(incident.incident_id);
      const typeObj = incidentTypes.find(t => t.name === incident.incident_type);
      const statusObj = incidentStatuses.find(s => s.description === incident.incident_status);
      setFormData({
        incident_type_id: typeObj?.incident_type_id || '',
        date: incident.date || '',
        description: incident.description || '',
        incident_status_id: statusObj?.incident_status_id || 1,
      });
    } else {
      setEditingId(null);
      setFormData({ incident_type_id: '', date: '', description: '', incident_status_id: 1 });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(formData);
      const payload = {
        ...formData,
        incident_type_id: formData.incident_type_id ? Number(formData.incident_type_id) : undefined,
        incident_status_id: formData.incident_status_id ? Number(formData.incident_status_id) : undefined,
        date: formData.date || undefined,
      };

      if (editingId) {
        await api.redactIncident(editingId, payload);
      } else {
        await api.postIncident(payload);
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
          type="date"
          className="date-filter-select"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <span className="page-header-label">по</span>
        <input
          type="date"
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
          <div className="table-cell table-cell--head">Номер дела</div>
        </div>

        {incidents.map(incident => (
          <div key={incident.incident_id} className="table-row">
            <div className="table-cell table-cell--id">
              <span>{incident.incident_id}</span>
              {(isAdmin) && (
                <>
                  <button
                    className="text-link"
                    onClick={() => handleOpenModal(incident)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="text-link"
                    style={{ color: '#e74c3c' }}
                    onClick={() => handleDelete(incident.incident_id)}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
            <div className="table-cell">{incident.incident_type}</div>
            <div className="table-cell">{incident.description}</div>
            <div className="table-cell">{formatDate(incident.date)}</div>
            <div className="table-cell">{incident.incident_status}</div>
            <div className="table-cell">{incident.reg_number || ""}</div>
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
            name="incident_type_id"
            value={formData.incident_type_id}
            onChange={(e) => setFormData(prev => ({ ...prev, incident_type_id: e.target.value ? Number(e.target.value) : '' }))}
            required
          >
            <option value="">Выберите тип</option>
            {incidentTypes.map(type => (
              <option key={type.incident_type_id} value={type.incident_type_id}>
                {type.name}
              </option>
            ))}
          </select>

          <label className="form-label">Дата:</label>
            <input
              className="form-input"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
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
                name="incident_status_id"
                value={formData.incident_status_id}
                onChange={(e) => setFormData(prev => ({ ...prev, incident_status_id: e.target.value ? Number(e.target.value) : '' }))}
              >
                <option value="">Выберите статус</option>
                {incidentStatuses.map(status => (
                  <option key={status.incident_status_id} value={status.incident_status_id}>
                    {status.description}
                  </option>
                ))}
              </select>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
