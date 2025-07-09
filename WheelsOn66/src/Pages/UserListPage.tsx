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

type User = {
  _id: string;
  name: string;
  email: string;
  isBlocked?: boolean;
  isAdmin?: boolean;
  createdAt?: string;
};

export default function UserListPage({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [refresh, setRefresh] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'email' | 'admin' | 'blocked'>('name');
  const [asc, setAsc] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data));
  }, [token, refresh]);

  // Statistiques
  const total = users.length;
  const blocked = users.filter(u => u.isBlocked).length;
  const admins = users.filter(u => u.isAdmin).length;

  // Recherche
  let filteredUsers = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Tri avancé
  filteredUsers.sort((a, b) => {
    let res = 0;
    if (sortBy === 'name') res = a.name.localeCompare(b.name);
    else if (sortBy === 'email') res = a.email.localeCompare(b.email);
    else if (sortBy === 'date') res = new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
    else if (sortBy === 'admin') res = Number(b.isAdmin) - Number(a.isAdmin);
    else if (sortBy === 'blocked') res = Number(b.isBlocked) - Number(a.isBlocked);
    return asc ? res : -res;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Actions groupées
  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };
  const handleSelectAll = () => {
    if (selected.length === paginatedUsers.length) setSelected([]);
    else setSelected(paginatedUsers.map(u => u._id));
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      await axios.delete(`http://localhost:5001/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast('Utilisateur supprimé');
      setRefresh(r => !r);
    }
  };

  const handleBlock = async (id: string, block: boolean) => {
    await axios.put(
      `http://localhost:5001/api/admin/users/${id}/block`,
      { block },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setToast(block ? 'Utilisateur bloqué' : 'Utilisateur débloqué');
    setRefresh(r => !r);
  };

  // Actions groupées
  const handleBulkDelete = async () => {
    if (window.confirm('Supprimer les utilisateurs sélectionnés ?')) {
      await Promise.all(selected.map(id =>
        axios.delete(`http://localhost:5001/api/admin/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ));
      setToast('Utilisateurs supprimés');
      setSelected([]);
      setRefresh(r => !r);
    }
  };

  const handleBulkBlock = async (block: boolean) => {
    await Promise.all(selected.map(id =>
      axios.put(
        `http://localhost:5001/api/admin/users/${id}/block`,
        { block },
        { headers: { Authorization: `Bearer ${token}` } }
      )
    ));
    setToast(block ? 'Utilisateurs bloqués' : 'Utilisateurs débloqués');
    setSelected([]);
    setRefresh(r => !r);
  };

  // Export CSV
  const handleExport = () => {
    const header = ['Nom', 'Email', 'Admin', 'Bloqué', 'Créé le'];
    const rows = filteredUsers.map(u => [
      u.name, u.email, u.isAdmin ? 'Oui' : 'Non', u.isBlocked ? 'Oui' : 'Non', u.createdAt ? new Date(u.createdAt).toLocaleString() : ''
    ]);
    const csv = [header, ...rows].map(r => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'utilisateurs.csv';
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

  // Responsive table wrapper
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
      {/* Bouton vers la gestion des destinations */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <button
          onClick={() => window.location.href = '/destinations'}
          style={{
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '10px 18px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Gérer les destinations
        </button>
      </div>
      {/* Statistiques */}
      <div style={{ display: 'flex', gap: 24, marginBottom: 18, color: '#fff', fontWeight: 600, flexWrap: 'wrap' }}>
        <div>Total utilisateurs : {total}</div>
        <div>Admins : {admins}</div>
        <div>Bloqués : {blocked}</div>
      </div>
      {/* Recherche, tri, export */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Recherche nom ou email..."
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
          <option value="name">Nom</option>
          <option value="email">Email</option>
          <option value="date">Date de création</option>
          <option value="admin">Admin</option>
          <option value="blocked">Bloqué</option>
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
          <button onClick={() => handleBulkBlock(true)} style={{ background: '#ff9800', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer' }}>
            Bloquer sélection
          </button>
          <button onClick={() => handleBulkBlock(false)} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer' }}>
            Débloquer sélection
          </button>
        </div>
      )}
      {/* Tableau responsive */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#222', color: '#fff', minWidth: 700 }}>
          <thead>
            <tr style={{ background: '#333', position: 'sticky', top: 0 }}>
              <th><input type="checkbox" checked={selected.length === paginatedUsers.length && paginatedUsers.length > 0} onChange={handleSelectAll} /></th>
              <th style={{ padding: 10 }}>Nom</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Admin</th>
              <th style={{ padding: 10 }}>Bloqué</th>
              <th style={{ padding: 10 }}>Créé le</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #444', transition: 'background 0.2s' }}>
                <td><input type="checkbox" checked={selected.includes(u._id)} onChange={() => handleSelect(u._id)} /></td>
                <td style={{ padding: 10 }}>{u.name}</td>
                <td style={{ padding: 10 }}>{u.email}</td>
                <td style={{ padding: 10 }}>{u.isAdmin ? 'Oui' : 'Non'}</td>
                <td style={{ padding: 10 }}>{u.isBlocked ? 'Oui' : 'Non'}</td>
                <td style={{ padding: 10 }}>{u.createdAt ? new Date(u.createdAt).toLocaleString() : ''}</td>
                <td style={{ padding: 10, display: 'flex', gap: 6 }}>
                  <button
                    onClick={() => handleBlock(u._id, !u.isBlocked)}
                    style={{
                      background: u.isBlocked ? '#4caf50' : '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 5,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {u.isBlocked ? 'Débloquer' : 'Bloquer'}
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{
                      background: '#555',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 5,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Supprimer
                  </button>
                </td>
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