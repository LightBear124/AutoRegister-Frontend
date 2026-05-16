import { logoutUser } from './users';

export function getStoredUser() {
  const raw = localStorage.getItem('currentUser');
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem('currentUser');
    return null;
  }
}

export async function performLogout() {
  try {
    await logoutUser();
  } catch {
    // даже если backend logout не ответил, на фронте всё равно выходим
  }

  localStorage.removeItem('currentUser');
}
