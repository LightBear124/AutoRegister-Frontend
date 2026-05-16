import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getStoredUser, performLogout } from '../api/auth';
import { getFlights } from '../api/flights';
import { getCartInfo } from '../api/crossings';
import type { ApiUser, FlightListItem } from '../types/api';

export default function FlightsPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null);
  const [flights, setFlights] = useState<FlightListItem[]>([]);
  const [requestId, setRequestId] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  useEffect(() => {
    const user = getStoredUser();
    setCurrentUser(user as ApiUser | null);

    void loadFlights();
    void loadCart();
  }, []);

  const loadFlights = async () => {
    try {
      setLoading(true);
      setErrorText('');
      const data = await getFlights();
      setFlights(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось загрузить рейсы';
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  };

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
            Рейсы
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

      <main className="page-shell">
        <section className="page-card">
          <h1>Рейсы</h1>

          <div className="user-summary">
            <p>
              <strong>Пользователь:</strong>{' '}
              {currentUser?.full_name ?? 'Не определён'}
            </p>
            <p>
              <strong>Роль:</strong> {currentUser?.role ?? 'Не определена'}
            </p>
            <p>
              <strong>Терминал:</strong>{' '}
              {currentUser?.terminal_id ?? 'Все терминалы'}
            </p>
          </div>

          {loading && <p>Загрузка рейсов...</p>}
          {errorText && <p className="error-text">{errorText}</p>}

          {!loading && !errorText && (
            <div className="flights-grid">
              {flights.map((flight) => (
                <Link
                  key={flight.id}
                  className="flight-card"
                  to={`/flights/${flight.id}`}
                >
                  <div className="flight-card-top">
                    <h3>{flight.flight_number}</h3>
                    <span className="status-chip">{flight.status}</span>
                  </div>
                  <p>
                    <strong>Терминал:</strong> {flight.terminal_name}
                  </p>
                  <p>
                    <strong>Направление:</strong> {flight.direction}
                  </p>
                  <p>
                    <strong>Маршрут:</strong> {flight.route_name}
                  </p>
                  <p>
                    <strong>Дата:</strong> {flight.flight_date}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
