import React, { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { fetchCurrentUser } from './store/slices/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Toaster } from 'react-hot-toast';

const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const HealthPage = lazy(() => import('./pages/HealthPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const AIInsightsPage = lazy(() => import('./pages/AIInsightsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

function App() {
  const dispatch = useDispatch();
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !isAuthenticated) {
      dispatch(fetchCurrentUser() as any);
    }
  }, [token, dispatch, isAuthenticated]);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      }>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health" element={<HealthPage />} />
              <Route path="/appointments" element={<AppointmentsPage />} />
              <Route path="/ai-insights" element={<AIInsightsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;