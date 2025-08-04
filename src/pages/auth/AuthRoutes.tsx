import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthWizard } from './AuthWizard';
import { LoginPage } from './LoginPage';
import { SignupPage } from './SignupPage';

export const AuthRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/wizard" element={<AuthWizard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};