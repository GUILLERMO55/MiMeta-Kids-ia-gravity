import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './features/auth/LoginScreen';
import { ParentDashboard } from './features/parent/ParentDashboard';
import { ChildDashboard } from './features/child/ChildDashboard';
import { Settings } from './features/settings/Settings';
import { useStore } from './store/useStore';

const ProtectedRoute = ({ children, role }: { children: React.ReactElement, role: 'parent' | 'child' }) => {
  const user = useStore(state => state.currentUser);
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role && user.role !== 'parent') return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const darkMode = useStore(state => state.settings.darkMode);

  // Initialize dark mode class on mount
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background dark:bg-slate-900 font-sans text-gray-900 dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/parent" element={
            <ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>
          } />
          <Route path="/child" element={
            <ProtectedRoute role="child"><ChildDashboard /></ProtectedRoute>
          } />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
