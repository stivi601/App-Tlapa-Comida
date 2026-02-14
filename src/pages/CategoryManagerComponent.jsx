import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function CategoryManager({ API_URL }) {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        fetch(`${API_URL}/api/admin/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCategories(data);
            })
            .catch(console.error);
    }, [API_URL]);

    const handleAdd = async () => {
        if (!name.trim()) return;
        const res = await fetch(`${API_URL}/api/admin/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            const newCat = await res.json();
            setCategories([...categories, newCat]);
            setName('');
        } else {
            alert("Error al crear. Quizá ya existe.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Borrar esta categoría?")) return;
        const res = await fetch(`${API_URL}/api/admin/categories/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <div className="fade-in">
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.8rem' }}>Gestión de Categorías</h1>
                <p style={{ color: 'var(--text-light)' }}>Define los tipos de comida disponibles para los restaurantes (ej. Tacos, Pizza).</p>
            </header>

            <div className="card" style={{ marginBottom: '2rem', maxWidth: '600px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Nueva Categoría</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        className="input"
                        placeholder="Nombre..."
                        style={{ flex: 1 }}
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <button className="btn btn-primary" onClick={handleAdd}>
                        <Plus size={18} /> Agregar
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 0, maxWidth: '600px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <tr>
                            <th style={{ textAlign: 'left', padding: '1rem', color: '#64748B' }}>Nombre</th>
                            <th style={{ textAlign: 'right', padding: '1rem', color: '#64748B' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '1rem' }}>{cat.name}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button onClick={() => handleDelete(cat.id)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr><td colSpan="2" style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>No hay categorías registradas.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
