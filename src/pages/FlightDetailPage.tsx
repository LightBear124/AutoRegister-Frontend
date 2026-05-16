import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { performLogout } from '../api/auth';
import { addPassengerToDraft } from '../api/crossingPassengers';
import { getFlightById } from '../api/flights';
import { getCartInfo } from '../api/crossings';
import type { FlightDetail, FlightPassenger } from '../types/api';

export default function FlightDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState<FlightDetail | null>(null);
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(
    null,
  );
  const [requestId, setRequestId] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const flightId = Number(id);

  useEffect(() => {
    if (!flightId) {
      return;
    }

    void loadFlight();
    void loadCart();
  }, [flightId]);

  const loadFlight = async () => {
    try {
      setLoading(true);
      setErrorText('');
      const data = await getFlightById(flightId);
      setFlight(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось загрузить рейс';
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

  const selectedPassenger = useMemo(
    () =>
      flight?.passengers.find(
        (passenger) => passenger.id === selectedPassengerId,
      ) ?? null,
    [flight, selectedPassengerId],
  );

  const closeModal = () => {
    setSelectedPassengerId(null);
    setActionError('');
    setActionSuccess('');
  };

  const handleLogout = async () => {
    await performLogout();
    navigate('/login', { replace: true });
  };

  const handleAddToRequest = async () => {
    if (!selectedPassenger) {
      return;
    }

    setActionError('');
    setActionSuccess('');

    try {
      await addPassengerToDraft(selectedPassenger.id);
      await loadCart();
      setActionSuccess('Пассажир добавлен в заявку');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Не удалось добавить пассажира';
      setActionError(message);
    }
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
          {loading && <p>Загрузка рейса...</p>}
          {errorText && <p className="error-text">{errorText}</p>}

          {!loading && flight && (
            <>
              <div className="flight-header">
                <div>
                  <h1>Рейс {flight.flight_number}</h1>
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
                </div>

                <span className="status-chip">{flight.status}</span>
              </div>

              <h2>Пассажиры рейса</h2>

              <div className="table-wrap">
                <table className="passengers-table">
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Место</th>
                      <th>Гражданство</th>
                      <th>Паспорт</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flight.passengers.map((passenger: FlightPassenger) => (
                      <tr key={passenger.id}>
                        <td>{passenger.full_name}</td>
                        <td>{passenger.seat_number}</td>
                        <td>{passenger.citizenship}</td>
                        <td>{passenger.passport_number}</td>
                        <td>
                          <button
                            type="button"
                            className="open-modal-button"
                            onClick={() => setSelectedPassengerId(passenger.id)}
                          >
                            Открыть
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </main>

      {selectedPassenger && flight && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-window"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={closeModal}
            >
              ×
            </button>

            <div className="modal-card">
              <div className="modal-header">
                <h3>{selectedPassenger.full_name}</h3>
                <p>
                  <strong>Рейс:</strong> {flight.flight_number}
                </p>
                <p>
                  <strong>Терминал:</strong> {flight.terminal_name}
                </p>
              </div>

              <div className="modal-body">
                <div className="modal-section">
                  <h4>Данные пассажира</h4>
                  <p>
                    <strong>Место:</strong> {selectedPassenger.seat_number}
                  </p>
                  <p>
                    <strong>Дата рождения:</strong>{' '}
                    {selectedPassenger.birth_date}
                  </p>
                  <p>
                    <strong>Количество прошлых поездок:</strong>{' '}
                    {selectedPassenger.previous_trips_count}
                  </p>
                </div>

                <div className="modal-section">
                  <h4>Паспортные данные</h4>
                  <p>
                    <strong>Номер паспорта:</strong>{' '}
                    {selectedPassenger.passport_number}
                  </p>
                  <p>
                    <strong>Гражданство:</strong>{' '}
                    {selectedPassenger.citizenship}
                  </p>
                  <p>
                    <strong>Срок действия:</strong>{' '}
                    {selectedPassenger.expiry_date}
                  </p>
                  <p>{selectedPassenger.description}</p>

                  {selectedPassenger.image_url && (
                    <img
                      src={selectedPassenger.image_url}
                      alt={selectedPassenger.full_name}
                      className="modal-passport-image"
                    />
                  )}
                </div>

                {actionError && <p className="error-text">{actionError}</p>}
                {actionSuccess && (
                  <p className="success-text">{actionSuccess}</p>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleAddToRequest}
                  >
                    Добавить в заявку
                  </button>

                  {requestId > 0 && (
                    <Link
                      to={`/request/${requestId}`}
                      className="secondary-button"
                    >
                      Открыть заявку
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
