import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { performLogout } from '../api/auth';
import { allowPassenger, denyPassenger } from '../api/crossingPassengers';
import {
  completeCrossing,
  deleteCrossing,
  getCrossingById,
  rejectCrossing,
} from '../api/crossings';
import type { CrossingDetail } from '../types/api';

export default function RequestPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState<CrossingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const requestId = Number(id);

  useEffect(() => {
    if (!requestId) {
      return;
    }

    void loadRequest();
  }, [requestId]);

  const loadRequest = async () => {
    try {
      setLoading(true);
      setErrorText('');
      const data = await getCrossingById(requestId);
      setRequest(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось загрузить заявку';
      setErrorText(message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await performLogout();
    navigate('/login', { replace: true });
  };

  const handleAllow = async (
    passengerId: number,
    queueNumber: number,
    isMain: boolean,
  ) => {
    try {
      setErrorText('');
      await allowPassenger(requestId, passengerId, queueNumber, isMain);
      await loadRequest();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось обновить решение';
      setErrorText(message);
    }
  };

  const handleDeny = async (
    passengerId: number,
    queueNumber: number,
    isMain: boolean,
  ) => {
    try {
      setErrorText('');
      await denyPassenger(requestId, passengerId, queueNumber, isMain);
      await loadRequest();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось обновить решение';
      setErrorText(message);
    }
  };

  const handleComplete = async () => {
    try {
      setErrorText('');
      await completeCrossing(requestId);
      navigate('/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось завершить заявку';
      setErrorText(message);
    }
  };

  const handleReject = async () => {
    try {
      setErrorText('');
      await rejectCrossing(requestId);
      navigate('/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось отклонить заявку';
      setErrorText(message);
    }
  };

  const handleDelete = async () => {
    try {
      setErrorText('');
      await deleteCrossing(requestId);
      navigate('/home');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Не удалось удалить заявку';
      setErrorText(message);
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
          {loading && <p>Загрузка заявки...</p>}
          {errorText && <p className="error-text">{errorText}</p>}

          {!loading && request && (
            <>
              <div className="request-header">
                <div>
                  <h1>Заявка №{request.id}</h1>
                  <p>
                    <strong>Терминал:</strong> {request.terminal_name}
                  </p>
                  <p>
                    <strong>Рейс:</strong> {request.flight_number}
                  </p>
                  <p>
                    <strong>Статус:</strong> {request.status}
                  </p>
                  <p>
                    <strong>Результат проверки:</strong>{' '}
                    {request.inspection_result}
                  </p>
                  <p>
                    <strong>Количество допущенных:</strong>{' '}
                    {request.approved_count}
                  </p>
                </div>

                {request.status === 'draft' && (
                  <div className="request-top-actions">
                    <button
                      type="button"
                      className="complete-button"
                      onClick={handleComplete}
                    >
                      Завершить выполнением
                    </button>

                    <button
                      type="button"
                      className="reject-button"
                      onClick={handleReject}
                    >
                      Завершить отказом
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={handleDelete}
                    >
                      Удалить заявку
                    </button>
                  </div>
                )}
              </div>

              <h2>Пассажиры в заявке</h2>

              <div className="table-wrap">
                <table className="passengers-table">
                  <thead>
                    <tr>
                      <th>Очередь</th>
                      <th>ФИО</th>
                      <th>Паспорт</th>
                      <th>Гражданство</th>
                      <th>Место</th>
                      <th>Решение</th>
                      <th>Главный</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {request.passengers.map((item) => (
                      <tr key={item.passenger_id}>
                        <td>{item.queue_number}</td>
                        <td>{item.full_name}</td>
                        <td>{item.passport_number}</td>
                        <td>{item.citizenship}</td>
                        <td>{item.seat_number}</td>
                        <td>{item.decision}</td>
                        <td>{item.is_main ? 'Да' : 'Нет'}</td>
                        <td>
                          {request.status === 'draft' ? (
                            <div className="decision-actions">
                              <button
                                type="button"
                                className="allow-button"
                                onClick={() =>
                                  handleAllow(
                                    item.passenger_id,
                                    item.queue_number,
                                    item.is_main,
                                  )
                                }
                              >
                                Пропустить
                              </button>

                              <button
                                type="button"
                                className="deny-button"
                                onClick={() =>
                                  handleDeny(
                                    item.passenger_id,
                                    item.queue_number,
                                    item.is_main,
                                  )
                                }
                              >
                                Отказать
                              </button>
                            </div>
                          ) : (
                            <span>Заявка закрыта</span>
                          )}
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
    </div>
  );
}
