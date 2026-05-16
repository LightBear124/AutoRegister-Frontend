import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/users';
import { getStoredUser } from '../api/auth';

export default function LoginPage() {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorText('');
    setLoading(true);

    try {
      const response = await loginUser(login, password);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      navigate('/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Ошибка авторизации';
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/" className="topbar-link">
            Главная
          </Link>
        </div>
      </header>

      <main className="auth-page">
        <section className="auth-card">
          <div className="auth-badge">
            Система автоматического паспортного контроля
          </div>
          <h1 className="auth-title">Вход в систему</h1>
          <p className="auth-subtitle">
            После входа пользователь попадает на главную страницу системы и
            получает доступ к терминалу, рейсам и заявкам в соответствии со
            своей ролью.
          </p>

          {errorText && <p className="error-text">{errorText}</p>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label htmlFor="login">Логин</label>
            <input
              id="login"
              name="login"
              type="text"
              placeholder="Введите логин"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
            />

            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
