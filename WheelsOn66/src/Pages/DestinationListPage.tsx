import React, { useEffect, useState } from 'react';
import axios from 'axios';

type RoadTrip = {
  _id: string;
  name: string;
  destination: string;
  description?: string;
  stops?: {
    name: string;
    description?: string;
    coordinates?: { lat?: number; lng?: number };
  }[];
};

type Destination = {
  _id: string;
  name: string;
  roadTripId?: string;
};

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

export default function DestinationListPage({ token }: { token: string }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [roadtrips, setRoadtrips] = useState<RoadTrip[]>([]);
  const [newDest, setNewDest] = useState('');
  const [newRoadTrip, setNewRoadTrip] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editRoadTrip, setEditRoadTrip] = useState('');
  const [toast, setToast] = useState('');
  const [refresh, setRefresh] = useState(false);

  // Pour filtrer les roadtrips par pays sélectionné
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Pour ajouter un roadtrip à ce pays
  const [newRTName, setNewRTName] = useState('');
  const [newRTDesc, setNewRTDesc] = useState('');
  const [newStops, setNewStops] = useState<{ name: string, description?: string, lat?: number, lng?: number }[]>([
    { name: '', description: '', lat: undefined, lng: undefined }
  ]);

  // Pour éditer un roadtrip
  const [editingRoadTrip, setEditingRoadTrip] = useState<RoadTrip | null>(null);
  const [editRTName, setEditRTName] = useState('');
  const [editRTDesc, setEditRTDesc] = useState('');
  const [editStops, setEditStops] = useState<{ name: string, description?: string, lat?: number, lng?: number }[]>([]);

  // Récupère destinations et roadtrips
  useEffect(() => {
    axios.get('http://localhost:5001/api/destinations', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setDestinations(res.data));
    axios.get('http://localhost:5001/api/roadtrips/all', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setRoadtrips(res.data));
  }, [token, refresh]);

  // Ajouter une destination
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDest.trim()) return;
    await axios.post('http://localhost:5001/api/destinations', {
      name: newDest,
      roadTripId: newRoadTrip || undefined
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setToast('Destination ajoutée');
    setNewDest('');
    setNewRoadTrip('');
    setRefresh(r => !r);
  };

  // Supprimer une destination
  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cette destination ?')) {
      await axios.delete(`http://localhost:5001/api/destinations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast('Destination supprimée');
      setRefresh(r => !r);
    }
  };

  // Modifier une destination (nom, roadtrip)
  const handleEdit = async (id: string) => {
    await axios.put(`http://localhost:5001/api/destinations/${id}`, {
      name: editValue,
      roadTripId: editRoadTrip || undefined
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setToast('Destination modifiée');
    setEditId(null);
    setEditValue('');
    setEditRoadTrip('');
    setRefresh(r => !r);
  };

  // Ajouter un roadtrip avec des stops
  const handleAddRoadTripWithStops = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry || !newRTName.trim()) return;

    await axios.post('http://localhost:5001/api/roadtrips', {
      name: newRTName,
      destination: selectedCountry,
      description: newRTDesc,
      stops: newStops
        .filter(s => s.name && s.name.trim() !== '')
        .map(s => ({
          name: s.name,
          description: s.description,
          coordinates: {
            lat: s.lat ?? undefined,
            lng: s.lng ?? undefined
          }
        }))
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setToast('Roadtrip avec stops ajouté');
    setNewRTName('');
    setNewRTDesc('');
    setNewStops([{ name: '', description: '', lat: undefined, lng: undefined }]);
    setRefresh(r => !r);
  };

  // Ajoute un stop (ajout)
  const addStop = () => {
    setNewStops([...newStops, { name: '', description: '', lat: undefined, lng: undefined }]);
  };
  // Met à jour un stop (ajout)
  const updateStop = (index: number, field: 'name' | 'description' | 'lat' | 'lng', value: string) => {
    const updatedStops = [...newStops];
    // @ts-ignore
    updatedStops[index][field] = field === 'lat' || field === 'lng' ? parseFloat(value) : value;
    setNewStops(updatedStops);
  };
  // Supprime un stop (ajout)
  const removeStop = (index: number) => {
    setNewStops(newStops.filter((_, idx) => idx !== index));
  };

  // Ajoute un stop (édition)
  const addEditStop = () => {
    setEditStops([...editStops, { name: '', description: '', lat: undefined, lng: undefined }]);
  };
  // Met à jour un stop (édition)
  const updateEditStop = (index: number, field: 'name' | 'description' | 'lat' | 'lng', value: string) => {
    const updatedStops = [...editStops];
    // @ts-ignore
    updatedStops[index][field] = field === 'lat' || field === 'lng' ? parseFloat(value) : value;
    setEditStops(updatedStops);
  };
  // Supprime un stop (édition)
  const removeEditStop = (index: number) => {
    setEditStops(editStops.filter((_, idx) => idx !== index));
  };

  // Modifier un roadtrip
  const handleEditRoadTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoadTrip) return;
    await axios.put(`http://localhost:5001/api/roadtrips/${editingRoadTrip._id}`, {
      name: editRTName,
      destination: selectedCountry,
      description: editRTDesc,
      stops: editStops
        .filter(s => s.name && s.name.trim() !== '')
        .map(s => ({
          name: s.name,
          description: s.description,
          coordinates: {
            lat: s.lat ?? undefined,
            lng: s.lng ?? undefined
          }
        }))
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setToast('Roadtrip modifié');
    setEditingRoadTrip(null);
    setEditRTName('');
    setEditRTDesc('');
    setEditStops([]);
    setRefresh(r => !r);
  };

  // Supprimer un roadtrip
  const handleDeleteRoadTrip = async () => {
    if (!editingRoadTrip) return;
    if (window.confirm('Supprimer ce roadtrip ?')) {
      await axios.delete(`http://localhost:5001/api/roadtrips/${editingRoadTrip._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast('Roadtrip supprimé');
      setEditingRoadTrip(null);
      setEditRTName('');
      setEditRTDesc('');
      setEditStops([]);
      setRefresh(r => !r);
    }
  };

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Responsive styles
  const tableWrapperStyle: React.CSSProperties = {
    overflowX: 'auto',
    width: '100%',
    marginBottom: 24
  };
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#222',
    color: '#fff',
    minWidth: 480
  };

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      background: '#222',
      borderRadius: 12,
      padding: 16,
      boxShadow: '0 2px 16px #0006'
    }}>
      <Toast message={toast} />
      <h2 style={{ color: '#fff', textAlign: 'center', marginBottom: 24 }}>Gestion des destinations</h2>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          value={newDest}
          onChange={e => setNewDest(e.target.value)}
          placeholder="Nouvelle destination"
          style={{
            flex: 1,
            minWidth: 180,
            padding: 10,
            borderRadius: 6,
            border: '1px solid #444',
            background: '#333',
            color: '#fff'
          }}
        />
        <button type="submit" style={{
          background: '#4e54c8',
          color: '#fff',
          border: 'none',
          borderRadius: 6,
          padding: '10px 18px',
          fontWeight: 600,
          cursor: 'pointer'
        }}>Ajouter</button>
      </form>
      <div style={tableWrapperStyle}>
        <table style={tableStyle}>
          <thead>
            <tr style={{ background: '#333' }}>
              <th style={{ padding: 10 }}>Nom</th>
              <th style={{ padding: 10 }}>Roadtrip</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map(dest => (
              <React.Fragment key={dest._id}>
                <tr
                  style={{
                    borderBottom: '1px solid #444',
                    cursor: 'pointer',
                    background: selectedCountry === dest.name ? '#333' : undefined
                  }}
                  onClick={() => {
                    setSelectedCountry(selectedCountry === dest.name ? null : dest.name);
                    setNewRTName('');
                    setNewRTDesc('');
                    setNewStops([{ name: '', description: '', lat: undefined, lng: undefined }]);
                    setEditingRoadTrip(null);
                  }}
                >
                  <td style={{ padding: 10 }}>
                    {editId === dest._id ? (
                      <input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        style={{
                          padding: 8,
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#333',
                          color: '#fff'
                        }}
                      />
                    ) : dest.name}
                  </td>
                  <td style={{ padding: 10 }}>
                    {editId === dest._id ? (
                      <input
                        value={editRoadTrip}
                        onChange={e => setEditRoadTrip(e.target.value)}
                        style={{
                          padding: 8,
                          borderRadius: 6,
                          border: '1px solid #444',
                          background: '#333',
                          color: '#fff'
                        }}
                      />
                    ) : (
                      roadtrips.find(rt => rt._id === dest.roadTripId)?.name || ''
                    )}
                  </td>
                  <td style={{ padding: 10 }}>
                    {editId === dest._id ? (
                      <>
                        <button onClick={() => handleEdit(dest._id)} style={{
                          background: '#388e3c', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', marginRight: 8, cursor: 'pointer'
                        }}>Valider</button>
                        <button onClick={e => { e.stopPropagation(); setEditId(null); setEditValue(''); setEditRoadTrip(''); }} style={{
                          background: '#f44336', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer'
                        }}>Annuler</button>
                      </>
                    ) : (
                      <>
                        <button onClick={e => {
                          e.stopPropagation();
                          setEditId(dest._id);
                          setEditValue(dest.name);
                          setEditRoadTrip(dest.roadTripId || '');
                        }} style={{
                          background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', marginRight: 8, cursor: 'pointer'
                        }}>Modifier</button>
                        <button onClick={e => { e.stopPropagation(); handleDelete(dest._id); }} style={{
                          background: '#f44336', color: '#fff', border: 'none', borderRadius: 5, padding: '6px 14px', cursor: 'pointer'
                        }}>Supprimer</button>
                      </>
                    )}
                  </td>
                </tr>
                {/* Affichage roadtrips et ajout/édition si ce pays est sélectionné */}
                {selectedCountry === dest.name && (
                  <tr>
                    <td colSpan={3} style={{ background: '#232323', padding: 0 }}>
                      <div style={{ padding: 16 }}>
                        <div style={{ marginBottom: 8, color: '#fff', fontWeight: 600 }}>
                          Roadtrips pour {dest.name} :
                        </div>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                          {roadtrips.filter(rt => rt.destination === dest.name).length === 0 && (
                            <li style={{ color: '#888' }}>Aucun roadtrip</li>
                          )}
                          {roadtrips.filter(rt => rt.destination === dest.name).map(rt => (
                            <li
                              key={rt._id}
                              style={{
                                color: '#fff',
                                marginBottom: 4,
                                cursor: 'pointer',
                                background: editingRoadTrip?._id === rt._id ? '#444' : undefined,
                                borderRadius: 4,
                                padding: '2px 6px'
                              }}
                              onClick={() => {
                                setEditingRoadTrip(rt);
                                setEditRTName(rt.name);
                                setEditRTDesc(rt.description || '');
                                setEditStops(
                                  rt.stops?.length
                                    ? rt.stops.map((s: any) => ({
                                        name: s.name,
                                        description: s.description,
                                        lat: s.coordinates?.lat,
                                        lng: s.coordinates?.lng
                                      }))
                                    : [{ name: '', description: '', lat: undefined, lng: undefined }]
                                );
                                setNewRTName('');
                                setNewRTDesc('');
                                setNewStops([{ name: '', description: '', lat: undefined, lng: undefined }]);
                              }}
                            >
                              <span style={{ fontWeight: 500 }}>{rt.name}</span>
                              {rt.description && <span style={{ color: '#aaa', marginLeft: 8 }}>({rt.description})</span>}
                            </li>
                          ))}
                        </ul>
                        {/* Formulaire édition roadtrip */}
                        {editingRoadTrip && (
                          <form
                            onSubmit={handleEditRoadTrip}
                            style={{ marginTop: 16, display: 'flex', gap: 10, flexDirection: 'column', background: '#292929', padding: 16, borderRadius: 8 }}
                          >
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              <input
                                value={editRTName}
                                onChange={e => setEditRTName(e.target.value)}
                                placeholder="Nom du roadtrip"
                                style={{ flex: 1, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
                              />
                              <input
                                value={editRTDesc}
                                onChange={e => setEditRTDesc(e.target.value)}
                                placeholder="Description"
                                style={{ flex: 2, minWidth: 120, padding: 8, borderRadius: 6, border: '1px solid #444', background: '#333', color: '#fff' }}
                              />
                            </div>
                            <div style={{ marginTop: 8 }}>
                              <div style={{ color: '#fff', marginBottom: 4 }}>Stops :</div>
                              {editStops.map((stop, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                  <input
                                    value={stop.name}
                                    onChange={e => updateEditStop(idx, 'name', e.target.value)}
                                    placeholder="Nom du stop"
                                    style={{ flex: 1, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                    required
                                  />
                                  <input
                                    value={stop.description}
                                    onChange={e => updateEditStop(idx, 'description', e.target.value)}
                                    placeholder="Description"
                                    style={{ flex: 2, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <input
                                    value={stop.lat ?? ''}
                                    onChange={e => updateEditStop(idx, 'lat', e.target.value)}
                                    placeholder="Lat"
                                    type="number"
                                    step="any"
                                    style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <input
                                    value={stop.lng ?? ''}
                                    onChange={e => updateEditStop(idx, 'lng', e.target.value)}
                                    placeholder="Lng"
                                    type="number"
                                    step="any"
                                    style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <button type="button" onClick={() => removeEditStop(idx)} style={{
                                    background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '0 10px', cursor: 'pointer'
                                  }}>✕</button>
                                </div>
                              ))}
                              <button type="button" onClick={addEditStop} style={{
                                background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', marginTop: 4, cursor: 'pointer'
                              }}>Ajouter un stop</button>
                            </div>
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              <button type="submit" style={{
                                background: '#4e54c8',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: 8
                              }}>Enregistrer</button>
                              <button type="button" onClick={handleDeleteRoadTrip} style={{
                                background: '#f44336',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: 8
                              }}>Supprimer</button>
                              <button type="button" onClick={() => {
                                setEditingRoadTrip(null);
                                setEditRTName('');
                                setEditRTDesc('');
                                setEditStops([]);
                              }} style={{
                                background: '#888',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 6,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: 8
                              }}>Annuler</button>
                            </div>
                          </form>
                        )}
                        {/* Formulaire d'ajout roadtrip (si pas en édition) */}
                        {!editingRoadTrip && (
                          <form
                            onSubmit={handleAddRoadTripWithStops}
                            style={{ display: 'flex', gap: 10, marginTop: 12, flexDirection: 'column' }}
                          >
                            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                              <input
                                value={newRTName}
                                onChange={e => setNewRTName(e.target.value)}
                                placeholder={`Nom du roadtrip pour ${dest.name}`}
                                style={{
                                  flex: 1,
                                  minWidth: 120,
                                  padding: 8,
                                  borderRadius: 6,
                                  border: '1px solid #444',
                                  background: '#333',
                                  color: '#fff'
                                }}
                              />
                              <input
                                value={newRTDesc}
                                onChange={e => setNewRTDesc(e.target.value)}
                                placeholder="Description"
                                style={{
                                  flex: 2,
                                  minWidth: 120,
                                  padding: 8,
                                  borderRadius: 6,
                                  border: '1px solid #444',
                                  background: '#333',
                                  color: '#fff'
                                }}
                              />
                            </div>
                            {/* Gestion dynamique des stops */}
                            <div style={{ marginTop: 8 }}>
                              <div style={{ color: '#fff', marginBottom: 4 }}>Stops :</div>
                              {newStops.map((stop, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                                  <input
                                    value={stop.name}
                                    onChange={e => updateStop(idx, 'name', e.target.value)}
                                    placeholder="Nom du stop"
                                    style={{ flex: 1, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                    required
                                  />
                                  <input
                                    value={stop.description}
                                    onChange={e => updateStop(idx, 'description', e.target.value)}
                                    placeholder="Description"
                                    style={{ flex: 2, minWidth: 100, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <input
                                    value={stop.lat ?? ''}
                                    onChange={e => updateStop(idx, 'lat', e.target.value)}
                                    placeholder="Lat"
                                    type="number"
                                    step="any"
                                    style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <input
                                    value={stop.lng ?? ''}
                                    onChange={e => updateStop(idx, 'lng', e.target.value)}
                                    placeholder="Lng"
                                    type="number"
                                    step="any"
                                    style={{ width: 80, padding: 6, borderRadius: 4, border: '1px solid #444', background: '#333', color: '#fff' }}
                                  />
                                  <button type="button" onClick={() => removeStop(idx)} style={{
                                    background: '#f44336', color: '#fff', border: 'none', borderRadius: 4, padding: '0 10px', cursor: 'pointer'
                                  }}>✕</button>
                                </div>
                              ))}
                              <button type="button" onClick={addStop} style={{
                                background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', marginTop: 4, cursor: 'pointer'
                              }}>Ajouter un stop</button>
                            </div>
                            <button type="submit" style={{
                              background: '#4e54c8',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 6,
                              padding: '8px 16px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              marginTop: 8
                            }}>Ajouter</button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Responsive style */}
      <style>{`
        @media (max-width: 800px) {
          div[style*="max-width: 900px"] { padding: 4px !important; }
          table { min-width: 320px !important; }
          input, select, button { font-size: 15px !important; }
        }
        @media (max-width: 600px) {
          div[style*="max-width: 900px"] { padding: 0 !important; }
          table { min-width: 220px !important; }
          h2 { font-size: 1.1em !important; }
        }
      `}</style>
    </div>
  );
}