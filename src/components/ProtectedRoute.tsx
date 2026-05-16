import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userRaw = localStorage.getItem('currentUser');

  if (!userRaw) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
