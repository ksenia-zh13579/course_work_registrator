import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
import styles from './Involvements.module.scss';

export default function Involvements() {
  const { isAdmin } = useAuth();
  const [involvements, setInvolvements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    incidentId: '',
    participantId: '',
    status: '',
  });

  useEffect(() => {
    loadInvolvements();
  }, []);

  const loadInvolvements = async () => {
    try {
      if (searchQuery) {
        const res = await api.getInvolvementsQuery(searchQuery);
        setInvolvements(res.data);
      } else {
        const res = await api.getInvolvements();
        setInvolvements(res.data);
      }
    } catch (err) {
      console.error('Error loading involvements:', err);
    }
  };

  const handleOpenModal = (involvement = null) => {
    if (involvement) {
      setEditingId(involvement.id);
      setFormData({
        incidentId: involvement.incidentId || '',
        participantId: involvement.participantId || '',
        status: involvement.status || '',
      });
    } else {
      setEditingId(null);
      setFormData({ incidentId: '', participantId: '', status: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.redactInvolvements(editingId, formData);
      } else {
        await api.postInvolvement(formData);
      }
      setShowModal(false);
      await loadInvolvements();
    } catch (err) {
      console.error('Error saving involvement:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить статус участника?')) {
      try {
        await api.deleteInvolvement(id);
        await loadInvolvements();
      } catch (err) {
        console.error('Error deleting involvement:', err);
      }
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Участники происшествий</h1>

      <div className="page-header-row">
        <span className="page-header-label">Поиск по ФИО и типу:</span>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={loadInvolvements}
          onKeyDown={(e) => e.key === 'Enter' && loadInvolvements()}
          placeholder="Поиск..."
        />
      </div>

      {isAdmin && (
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          + Добавить новый статус участника
        </button>
      )}

      <div className="data-table">
        <div className="table-head-row">
          <div className="table-cell table-cell--head table-cell--id">ID Происшествия</div>
          <div className="table-cell table-cell--head">Тип происшествия</div>
          <div className="table-cell table-cell--head">ID участника</div>
          <div className="table-cell table-cell--head">ФИО участника</div>
          <div className="table-cell table-cell--head">Статус участника</div>
        </div>

        {involvements.map(inv => (
          <div key={inv.id} className="table-row">
            <div className="table-cell table-cell--id">
              <span>{inv.incidentId}</span>
              {isAdmin && (
                <>
                  <button
                    className="text-link"
                    onClick={() => handleOpenModal(inv)}
                  >
                    Редактировать
                  </button>
                  <button
                    className="text-link"
                    style={{ color: '#e74c3c' }}
                    onClick={() => handleDelete(inv.id)}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
            <div className="table-cell">{inv.incidentType}</div>
            <div className="table-cell">{inv.participantId}</div>
            <div className="table-cell">{inv.participantName}</div>
            <div className="table-cell">{inv.status}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editingId ? 'Редактировать статус участника' : 'Добавить новый статус участника'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <label className="form-label">ID происшествия:</label>
          <input
            className="form-input"
            type="text"
            value={formData.incidentId}
            onChange={(e) => setFormData(prev => ({ ...prev, incidentId: e.target.value }))}
            placeholder="12341"
            required
          />

          <label className="form-label">ID участника:</label>
          <input
            className="form-input"
            type="text"
            value={formData.participantId}
            onChange={(e) => setFormData(prev => ({ ...prev, participantId: e.target.value }))}
            placeholder="765"
            required
          />

          <label className="form-label">Статус участника:</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            required
          >
            <option value="">Выберите статус</option>
            <option value="Подозреваемый">Подозреваемый</option>
            <option value="Свидетель">Свидетель</option>
            <option value="Потерпевший">Потерпевший</option>
            <option value="Виновник">Виновник</option>
          </select>
        </Modal>
      )}
    </div>
  );
}
