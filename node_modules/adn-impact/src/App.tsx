import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { MonthlyRanking } from './pages/MonthlyRanking';
import { UserProfile } from './pages/UserProfile';
import { LeaderAdmin } from './pages/LeaderAdmin';
import { MainLayout } from './layout/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App routes */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ranking" element={<MonthlyRanking />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/admin" element={<LeaderAdmin />} />
        </Route>

        {/* Home redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
