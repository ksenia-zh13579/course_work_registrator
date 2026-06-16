import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
// import styles from './Involvements.module.scss';

export default function Involvements() {
  const { isAdmin } = useAuth();
  const [involvements, setInvolvements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    incident_id: '',
    participant_id: '',
    status: '',
  });

  const statusStrings = {
    'WITNESS': 'Свидетель', 
    'SUSPECT': 'Подозреваемый',
    'GUILTY': 'Виновник',
    'VICTIM': 'Потерпевший'
  };

  const loadInvolvements = async () => {
    try {
      const res = searchQuery
        ? await api.getInvolvementsQuery(searchQuery)
        : await api.getInvolvements();

      const items = res.data?.data ?? res.data;
      setInvolvements(items);
    } catch (err) {
      console.error('Error loading involvements:', err);
    }
  };

  useEffect(() => {
    loadInvolvements();
  }, []);

  const handleOpenModal = (involvement = null) => {
    if (involvement) {
      setEditingId(involvement.involvement_id);
      setFormData({
        incident_id: involvement.incident_id || '',
        participant_id: involvement.participant_id || '',
        status: involvement.status || '',
      });
    } else {
      setEditingId(null);
      setFormData({ incident_id: '', participant_id: '', status: '' });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      const payload = {
        ...formData,
        incident_id: formData.incident_id ? Number(formData.incident_id) : undefined,
        participant_id: formData.participant_id ? Number(formData.participant_id) : undefined,
        status: formData.status || undefined,
      };

      if (editingId) {
        await api.redactInvolvements(editingId, payload);
      } else {
        await api.postInvolvement(payload);
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
          <div key={inv.involvement_id} className="table-row">
            <div className="table-cell table-cell--id">
              <span>{inv.incident_id}</span>
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
                    onClick={() => handleDelete(inv.involvement_id)}
                  >
                    Удалить
                  </button>
                </>
              )}
            </div>
            <div className="table-cell">{inv.incident_type}</div>
            <div className="table-cell">{inv.participant_id}</div>
            <div className="table-cell">{inv.full_name}</div>
            <div className="table-cell">{statusStrings[inv.status]}</div>
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
            value={formData.incident_id}
            onChange={(e) => setFormData(prev => ({ ...prev, incident_id: e.target.value }))}
            placeholder="12341"
            required
          />

          <label className="form-label">ID участника:</label>
          <input
            className="form-input"
            type="text"
            value={formData.participant_id}
            onChange={(e) => setFormData(prev => ({ ...prev, participant_id: e.target.value }))}
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
            <option value={"SUSPECT"}>{statusStrings["SUSPECT"]}</option>
            <option value={"WITNESS"}>{statusStrings["WITNESS"]}</option>
            <option value={"VICTIM"}>{statusStrings["VICTIM"]}</option>
            <option value={"GUILTY"}>{statusStrings["GUILTY"]}</option>
          </select>
        </Modal>
      )}
    </div>
  );
}
