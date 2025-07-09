import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Toast notification
function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, background: '#333', color: '#fff',
      padding: 16, borderRadius: 8, zIndex: 1000, boxShadow: '0 2px 8px #0008',
      fontWeight: 600, letterSpacing: 1
    }}>{message}</div>
  );
}

type Trip = {
  _id: string;
  user: { name: string; email: string };
  destination: string;
  createdAt: string;
};

export default function TripListPage({ token }: { token: string }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filterUser, setFilterUser] = useState('');
  const [filterDest, setFilterDest] = useState('');
  const [sortBy, setSortBy] = useState<'user' | 'destination' | 'date'>('date');
  const [asc, setAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/admin/trips', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setTrips(res.data));
  }, [token]);

  // Statistiques
  const total = trips.length;
  const uniqueUsers = new Set(trips.map(t => t.user?.name)).size;
  const uniqueDest = new Set(trips.map(t => t.destination)).size;

  // Filtres
  const users = Array.from(new Set(trips.map(t => t.user?.name).filter(Boolean)));
  const destinations = Array.from(new Set(trips.map(t => t.destination).filter(Boolean)));

  let filteredTrips = trips;
  if (filterUser) filteredTrips = filteredTrips.filter(t => t.user?.name === filterUser);
  if (filterDest) filteredTrips = filteredTrips.filter(t => t.destination === filterDest);
  if (search) {
    filteredTrips = filteredTrips.filter(t =>
      t.user?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Tri avancé
  filteredTrips.sort((a, b) => {
    let res = 0;
    if (sortBy === 'user') res = (a.user?.name || '').localeCompare(b.user?.name || '');
    else if (sortBy === 'destination') res = (a.destination || '').localeCompare(b.destination || '');
    else if (sortBy === 'date') res = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return asc ? res : -res;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage);
  const paginatedTrips = filteredTrips.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Actions groupées
  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === paginatedTrips.length) setSelected([]);
    else setSelected(paginatedTrips.map(t => t._id));
  };
  const handleBulkDelete = async () => {
    if (window.confirm('Supprimer les voyages sélectionnés ?')) {
      await Promise.all(selected.map(id =>
        axios.delete(`http://localhost:5001/api/admin/trips/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ));
      setToast('Voyages supprimés');
      setSelected([]);
      setPage(1);
      setTimeout(() => setPage(1), 100); // Pour forcer le refresh
    }
  };

  // Export CSV
  const handleExport = () => {
    const header = ['Utilisateur', 'Email', 'Destination', 'Date'];
    const rows = filteredTrips.map(t => [
      t.user?.name, t.user?.email, t.destination, t.createdAt ? new Date(t.createdAt).toLocaleString() : ''
    ]);
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voyages.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div style={{
      maxWidth: 1000,
      margin: '40px auto',
      background: '#222',
      borderRadius: 12,
      padding: 24,
      boxShadow: '0 2px 16px #0006'
    }}>
      <Toast message={toast} />
      {/* Statistiques */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 18, color: '#fff', fontWeight: 600, flexWrap: 'wrap' }}>
        <div>Total voyages : {total}</div>
        <div>Utilisateurs uniques : {uniqueUsers}</div>
        <div>Destinations uniques : {uniqueDest}</div>
      </div>
      {/* Recherche, tri, export */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Recherche par nom d'utilisateur..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: '1px solid #444',
            background: '#333',
            color: '#fff',
            minWidth: 200
          }}
        />
        <select value={filterUser} onChange={e => setFilterUser(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="">Tous les utilisateurs</option>
          {users.map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={filterDest} onChange={e => setFilterDest(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
          <option value="">Toutes les destinations</option>
          {destinations.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as any)}
          style={{
            padding: 8,
            borderRadius: 6,
            background: '#333',
            color: '#fff',
            border: '1px solid #444'
          }}
        >
          <option value="date">Date</option>
          <option value="user">Utilisateur</option>
          <option value="destination">Destination</option>
        </select>
        <button
          onClick={() => setAsc(a => !a)}
          style={{
            background: '#4e54c8',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            padding: '6px 14px',
            cursor: 'pointer'
          }}
        >
          {asc ? '▲' : '▼'}
        </button>
        <button onClick={handleExport} style={{ background: '#388e3c', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer' }}>
          Export CSV
        </button>
      </div>
      {/* Actions groupées */}
      {selected.length > 0 && (
        <div style={{ marginBottom: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button onClick={handleBulkDelete} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer' }}>
            Supprimer sélection
          </button>
        </div>
      )}
      {/* Tableau responsive */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222', color: '#fff', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#333', position: 'sticky', top: 0 }}>
              <th><input type="checkbox" checked={selected.length === paginatedTrips.length && paginatedTrips.length > 0} onChange={handleSelectAll} /></th>
              <th style={{ padding: 10 }}>Utilisateur</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Destination</th>
              <th style={{ padding: 10 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrips.map((t) => (
              <tr key={t._id} style={{ borderBottom: '1px solid #444', transition: 'background 0.2s' }}>
                <td><input type="checkbox" checked={selected.includes(t._id)} onChange={() => handleSelect(t._id)} /></td>
                <td style={{ padding: 10 }}>{t.user?.name}</td>
                <td style={{ padding: 10 }}>{t.user?.email}</td>
                <td style={{ padding: 10 }}>{t.destination}</td>
                <td style={{ padding: 10 }}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: 16, gap: 10 }}>
        <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ padding: '6px 14px', borderRadius: 5, border: 'none', background: '#444', color: '#fff', cursor: 'pointer' }}>Précédent</button>
        <span style={{ margin: '0 12px', color: '#fff' }}>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ padding: '6px 14px', borderRadius: 5, border: 'none', background: '#444', color: '#fff', cursor: 'pointer' }}>Suivant</button>
      </div>
    </div>
  );
}