import React, { useState } from 'react';
import axios from 'axios';

export default function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      if (res.data.user.isAdmin) {
        onLogin(res.data.token);
      } else {
        setError('Accès réservé aux administrateurs');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Identifiants invalides');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#222',
          padding: 32,
          borderRadius: 12,
          boxShadow: '0 2px 16px #0008',
          width: 340,
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: 8 }}>Connexion Admin</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: '1px solid #444',
            background: '#333',
            color: '#fff'
          }}
        />
        <input
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            padding: 10,
            borderRadius: 6,
            border: '1px solid #444',
            background: '#333',
            color: '#fff'
          }}
        />
        <button
          type="submit"
          style={{
            padding: 12,
            borderRadius: 6,
            border: 'none',
            background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 8
          }}
        >
          Connexion
        </button>
        {error && <div style={{ color: '#ff5252', textAlign: 'center', marginTop: 4 }}>{error}</div>}
      </form>
    </div>
  );
}