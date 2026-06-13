import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './SignIn.module.scss';

export default function SignIn() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ login: '', password: '' });
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
      await login(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container page-container--centered">
      <div className="auth-card">
        <h1 className="auth-card-title">Вход</h1>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <label className="form-label">
            Логин<span className="required-mark">*</span>:
          </label>
          <input
            className="form-input"
            type="text"
            name="login"
            value={form.login}
            onChange={handleChange}
            placeholder="user123"
            required
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
            {loading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <p className="auth-card-footer">
          Нет аккаунта?{' '}
          <Link to="/register" className="text-link text-link--inline">Регистрация</Link>
        </p>
      </div>
    </div>
  );
}
