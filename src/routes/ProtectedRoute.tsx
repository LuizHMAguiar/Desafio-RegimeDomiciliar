import React from 'react';
import { Navigate } from 'react-router-dom';
import { type User } from '../types';

interface Props {
  user: User | null;
  allowedRoles?: string[];
  children: React.ReactElement;
}

export function ProtectedRoute({ user, allowedRoles = [], children }: Props) {
  if (!user) return <Navigate to="/" replace />;
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}
