import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
    const navigate = useNavigate();
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
                ← Volver
            </button>
            <div className="card">
                <h1>Términos y Condiciones</h1>
                <p style={{ marginTop: '1rem' }}>
                    Bienvenido a Tlapa Comida. Al usar nuestra plataforma, aceptas los siguientes términos...
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <h3>1. Uso del Servicio</h3>
                    <p>La plataforma conecta usuarios con restaurantes locales...</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                    <h3>2. Pedidos y Pagos</h3>
                    <p>Los pedidos están sujetos a disponibilidad...</p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
