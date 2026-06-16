import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
import styles from './Profile.module.scss';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    patronymic: user?.patronymic || '',
    old_password: '',
    new_password: '',
    passwordConfirm: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.new_password && formData.new_password !== formData.passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const updatePayload = {
        name: formData.name,
        surname: formData.surname,
        patronymic: formData.patronymic,
        old_password: formData.old_password,
      };
      if (formData.new_password) {
        updatePayload.new_password = formData.new_password;
      }

      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] === '') delete updatePayload[key];
      });

      const res = await api.redactProfile(updatePayload);
      updateUser(res.data);
      setSuccess('Профиль обновлён');
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка обновления профиля');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Не удалось выйти из системы');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title page-title--accent">Профиль</h1>

      <div className={styles.profileContent}>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Имя пользователя:</span>
          <span className={styles.profileValue}>{user?.username || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Фамилия:</span>
          <span className={styles.profileValue}>{user?.surname || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Имя:</span>
          <span className={styles.profileValue}>{user?.name || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Отчество:</span>
          <span className={styles.profileValue}>{user?.patronymic || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Роль:</span>
          <span className={styles.profileValue}>
            {user?.role === 'admin' || user?.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}
          </span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => setShowModal(true)}>
        Редактировать
      </button>
      <button className="btn btn-primary" onClick={handleLogout}>
        Выйти
      </button>

      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      {showModal && (
        <Modal title="Редактировать профиль" onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
          <label className="form-label">Имя пользователя:</label>
          <input className="form-input" type="text" value={user?.username} disabled />

          <label className="form-label">Фамилия:</label>
          <input
            className="form-input"
            type="text"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
          />

          <label className="form-label">Имя:</label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label className="form-label">Отчество:</label>
          <input
            className="form-input"
            type="text"
            name="patronymic"
            value={formData.patronymic}
            onChange={handleChange}
          />

          <label className="form-label">Старый пароль:</label>
          <input
            className="form-input"
            type="password"
            name="old_password"
            value={formData.old_password}
            onChange={handleChange}
            placeholder="Введите старый пароль"
          />

          <label className="form-label">Новый пароль:</label>
          <input
            className="form-input"
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Оставьте пустым, если не хотите менять"
          />

          <label className="form-label">Подтвердите новый пароль:</label>
          <input
            className="form-input"
            type="password"
            name="passwordConfirm"
            value={formData.passwordConfirm}
            onChange={handleChange}
            placeholder="Подтвердите пароль"
          />

          {error && <p className={styles.errorMsg}>{error}</p>}
        </Modal>
      )}
    </div>
  );
}
