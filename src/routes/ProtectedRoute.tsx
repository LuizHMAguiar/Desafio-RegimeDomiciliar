import React from 'react';
import { Navigate } from 'react-router-dom';
import { type User } from '../types';

interface Props {
  user: User | null;
  allowedRoles?: string[];
  children: React.ReactElement;
}

/**
 * ProtectedRoute: protege rotas com base em autenticação e papéis.
 * - se não autenticado -> redireciona para `/login`
 * - se autenticado mas não autorizado -> redireciona para dashboard do próprio papel
 */
export function ProtectedRoute({ user, allowedRoles = [], children }: Props) {
  if (!user) return <Navigate to="/login" replace />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // redireciona para dashboard apropriado
    if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
    if (user.role === 'coordinator') return <Navigate to="/coordinator" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
}
