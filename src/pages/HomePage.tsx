import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCartInfo } from '../api/crossings';
import { getStoredUser, performLogout } from '../api/auth';
import type { ApiUser } from '../types/api';

export default function HomePage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [requestId, setRequestId] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    setCurrentUser(user as ApiUser);
    void loadCart();
  }, [navigate]);

  const loadCart = async () => {
    try {
      const cart = await getCartInfo();
      setRequestId(cart.id);
      setCartCount(cart.count);
    } catch {
      setRequestId(0);
      setCartCount(0);
    }
  };

  const handleLogout = async () => {
    await performLogout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="app-page">
      <header className="topbar">
        <div className="topbar-inner">
          <Link to="/home" className="topbar-link">
            Домой
          </Link>
          <Link to="/flights" className="topbar-link">
            Терминал и рейсы
          </Link>
          {requestId > 0 && (
            <Link to={`/request/${requestId}`} className="topbar-link">
              Текущая заявка ({cartCount})
            </Link>
          )}
          <button
            type="button"
            className="topbar-button"
            onClick={handleLogout}
          >
            Выход
          </button>
        </div>
      </header>

      <main className="home-page">
        <section className="hero-block">
          <div className="hero-text">
            <div className="hero-badge">Пограничный контроль</div>

            <h1>Система автоматического паспортного контроля</h1>

            <p>
              Система предназначена для работы операторов терминалов и
              модератора. После авторизации пользователь получает доступ к
              своему терминалу, рейсам, пассажирам и фактам пересечения границы.
            </p>

            <div className="hero-actions">
              <Link to="/flights" className="primary-button">
                Открыть терминал и рейсы
              </Link>

              {requestId > 0 && (
                <Link to={`/request/${requestId}`} className="secondary-button">
                  Открыть текущую заявку
                </Link>
              )}
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-empty">
              <div>
                <p>
                  <strong>Пользователь:</strong>{' '}
                  {currentUser?.full_name ?? 'Не определён'}
                </p>
                <p>
                  <strong>Роль:</strong> {currentUser?.role ?? 'Не определена'}
                </p>
                <p>
                  <strong>Terminal ID:</strong>{' '}
                  {currentUser?.terminal_id ?? 'Все терминалы'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
