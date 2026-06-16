import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Registration.module.scss';

export default function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    name: '',
    surname: '',
    patronymic: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-container--centered">
      <div className="auth-card">
        <h1 className="auth-card-title">Регистрация</h1>

        <form className={styles.regForm} onSubmit={handleSubmit}>
          <label className="form-label">
            Логин<span className="required-mark">*</span>:
          </label>
          <input
            className="form-input"
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="user123"
            required
          />

          <label className="form-label">
            Имя<span className="required-mark">*</span>:
          </label>
          <input
            className="form-input"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Елена"
            required
          />

          <label className="form-label">
            Фамилия<span className="required-mark">*</span>:
          </label>
          <input
            className="form-input"
            type="text"
            name="surname"
            value={form.surname}
            onChange={handleChange}
            placeholder="Смирнова"
            required
          />

          <label className="form-label">Отчество:</label>
          <input
            className="form-input"
            type="text"
            name="patronymic"
            value={form.patronymic}
            onChange={handleChange}
            placeholder="Ивановна"
          />

          <label className="form-label">
            Пароль<span className="required-mark">*</span>:
          </label>
          <input
            className="form-input"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="password123"
            required
          />

          {error && <p className={styles.errorMsg}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить'}
          </button>
        </form>

        <p className="auth-card-footer">
          Уже есть аккаунт?{' '}
          <Link to="/signin" className="text-link text-link--inline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
