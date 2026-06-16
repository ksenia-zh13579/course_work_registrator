import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
// import styles from './Participants.module.scss';

export default function Participants() {
  const { isAdmin } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    surname: '',
    name: '',
    patronymic: '',
    address: '',
    crimial_records: 0,
  });

  const loadParticipants = async () => {
    try {
      const res = searchQuery
        ? await api.getParticipantsQuery(searchQuery)
        : await api.getParticipants();
      const items = res.data?.data ?? res.data;
      setParticipants(items);
    } catch (err) {
      console.error('Error loading participants:', err);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, []);

  const handleOpenModal = (participant = null) => {
    if (participant) {
      setEditingId(participant.participant_id);
      setFormData({
        surname: participant.surname || '',
        name: participant.name || '',
        patronymic: participant.patronymic || '',
        address: participant.address || '',
        crimial_records: participant.crimial_records || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        surname: '',
        name: '',
        patronymic: '',
        address: '',
        crimial_records: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.redactParticipants(editingId, formData);
      } else {
        await api.postParticipant(formData);
      }
      setShowModal(false);
      await loadParticipants();
    } catch (err) {
      console.error('Error saving participant:', err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Удалить участника?')) {
      try {
        await api.deleteParticipant(id);
        await loadParticipants();
      } catch (err) {
        console.error('Error deleting participant:', err);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <p>Доступ запрещен. Эта страница только для администраторов.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Досье участников происшествий</h1>

      <div className="page-header-row">
        <span className="page-header-label">Поиск по ФИО:</span>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={loadParticipants}
          onKeyDown={(e) => e.key === 'Enter' && loadParticipants()}
          placeholder="Поиск..."
        />
      </div>

      <button className="btn btn-primary" onClick={() => handleOpenModal()}>
        + Добавить информацию об участнике
      </button>

      <div className="data-table">
        <div className="table-head-row">
          <div className="table-cell table-cell--head table-cell--id">ID лица</div>
          <div className="table-cell table-cell--head">Фамилия</div>
          <div className="table-cell table-cell--head">Имя</div>
          <div className="table-cell table-cell--head">Отчество</div>
          <div className="table-cell table-cell--head">Адрес</div>
          <div className="table-cell table-cell--head">Судимости</div>
        </div>

        {participants.map(participant => (
          <div key={participant.participant_id} className="table-row">
            <div className="table-cell table-cell--id">
              <span>{participant.participant_id}</span>
              <button
                className="text-link"
                onClick={() => handleOpenModal(participant)}
              >
                Редактировать
              </button>
              <button
                className="text-link"
                style={{ color: '#e74c3c' }}
                onClick={() => handleDelete(participant.participant_id)}
              >
                Удалить
              </button>
            </div>
            <div className="table-cell">{participant.surname}</div>
            <div className="table-cell">{participant.name}</div>
            <div className="table-cell">{participant.patronymic || ''}</div>
            <div className="table-cell">{participant.address}</div>
            <div className="table-cell">{participant.crimial_records}</div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          title={editingId ? 'Редактировать информацию об участнике' : 'Добавить нового участника'}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        >
          <label className="form-label">Фамилия:</label>
          <input
            className="form-input"
            type="text"
            value={formData.surname}
            onChange={(e) => setFormData(prev => ({ ...prev, surname: e.target.value }))}
            placeholder="Смирнова"
            required
          />

          <label className="form-label">Имя:</label>
          <input
            className="form-input"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Елена"
            required
          />

          <label className="form-label">Отчество:</label>
          <input
            className="form-input"
            type="text"
            value={formData.patronymic}
            onChange={(e) => setFormData(prev => ({ ...prev, patronymic: e.target.value }))}
            placeholder="Александровна"
          />

          <label className="form-label">Адрес:</label>
          <input
            className="form-input"
            type="text"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="г. Москва, ул. Ленина, 4к1"
            required
          />

          <label className="form-label">Количество судимостей:</label>
          <select
            className="form-select"
            value={formData.crimial_records}
            onChange={(e) => setFormData(prev => ({ ...prev, crimial_records: parseInt(e.target.value) }))}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5+</option>
          </select>
        </Modal>
      )}
    </div>
  );
}
