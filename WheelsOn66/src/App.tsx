import React, { useState, useEffect } from 'react';
import LoginPage from './Pages/LoginPage';
import UserListPage from './Pages/UserListPage';
import TripListPage from './Pages/TripListPage';
import DestinationListPage from './Pages/DestinationListPage';
import './App.css';

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [page, setPage] = useState<'users' | 'trips' | 'destinations'>('users');

  // Lire le token au chargement
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleLogin = (token: string) => {
    setToken(token);
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (!token) return <LoginPage onLogin={handleLogin} />;

  return (
    <div>
      <nav style={{ display: 'flex', gap: 8, justifyContent: 'center', margin: 20 }}>
        <button
          onClick={() => setPage('users')}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: page === 'users' ? '#23272f' : '#181818',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            boxShadow: page === 'users' ? '0 0 0 2px #90caf9' : undefined,
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          Utilisateurs
        </button>
        <button
          onClick={() => setPage('trips')}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: page === 'trips' ? '#23272f' : '#181818',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            boxShadow: page === 'trips' ? '0 0 0 2px #90caf9' : undefined,
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          Planifications
        </button>
        <button
          onClick={() => setPage('destinations')}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: page === 'destinations' ? '#23272f' : '#181818',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            boxShadow: page === 'destinations' ? '0 0 0 2px #90caf9' : undefined,
            transition: 'background 0.2s, box-shadow 0.2s'
          }}
        >
          Destinations
        </button>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 20px',
            borderRadius: 8,
            border: 'none',
            background: '#181818',
            color: '#fff',
            fontSize: 16,
            fontWeight: 500,
            transition: 'background 0.2s'
          }}
        >
          Déconnexion
        </button>
      </nav>
      {page === 'users' && <UserListPage token={token} />}
      {page === 'trips' && <TripListPage token={token} />}
      {page === 'destinations' && <DestinationListPage token={token} />}
    </div>
  );
}
