import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import Modal from '../../components/Modal/Modal';
import styles from './Profile.module.scss';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    middleName: user?.middleName || '',
    oldPassword: '',
    password: '',
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

    if (formData.password && formData.password !== formData.passwordConfirm) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const updatePayload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        middleName: formData.middleName,
      };
      if (formData.password) {
        updatePayload.oldPassword = formData.oldPassword;
        updatePayload.password = formData.password;
      }

      const res = await api.redactProfile(updatePayload);
      updateUser(res.data);
      setSuccess('Профиль обновлён');
      setShowModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка обновления профиля');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title page-title--accent">Профиль</h1>

      <div className={styles.profileContent}>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Имя пользователя:</span>
          <span className={styles.profileValue}>{user?.login || user?.username || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Фамилия:</span>
          <span className={styles.profileValue}>{user?.lastName || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Имя:</span>
          <span className={styles.profileValue}>{user?.firstName || 'N/A'}</span>
        </div>
        <div className={styles.profileRow}>
          <span className={styles.profileLabel}>Отчество:</span>
          <span className={styles.profileValue}>{user?.middleName || 'N/A'}</span>
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

      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      {showModal && (
        <Modal title="Редактировать профиль" onClose={() => setShowModal(false)} onSubmit={handleSubmit}>
          <label className="form-label">Имя пользователя:</label>
          <input className="form-input" type="text" value={user?.login} disabled />

          <label className="form-label">Фамилия:</label>
          <input
            className="form-input"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <label className="form-label">Имя:</label>
          <input
            className="form-input"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />

          <label className="form-label">Отчество:</label>
          <input
            className="form-input"
            type="text"
            name="middleName"
            value={formData.middleName}
            onChange={handleChange}
          />

          <label className="form-label">Старый пароль:</label>
          <input
            className="form-input"
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Введите старый пароль"
          />

          <label className="form-label">Новый пароль:</label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Оставьте пусто, если не хотите менять"
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
