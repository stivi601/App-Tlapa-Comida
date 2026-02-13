import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
    const navigate = useNavigate();
    return (
        <div className="container" style={{ padding: '2rem' }}>
            <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
                ← Volver
            </button>
            <div className="card">
                <h1>Política de Privacidad</h1>
                <p style={{ marginTop: '1rem' }}>
                    En Tlapa Comida valoramos tu privacidad. Esta política explica cómo manejamos tus datos...
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <h3>1. Recopilación de Datos</h3>
                    <p>Recopilamos información necesaria para el servicio de delivery...</p>
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                    <h3>2. Uso de la Información</h3>
                    <p>Tus datos se utilizan exclusivamente para procesar pedidos y mejorar el servicio...</p>
                </div>
            </div>
        </div>
    );
};

export default Privacy;
