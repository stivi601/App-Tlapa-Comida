const express = require('express');
const router = express.Router();
const { sendSMS } = require('../services/twilio');

// POST /api/sms/send
// Cuerpo esperado: { "to": "+52...", "body": "Mensaje..." }
router.post('/send', async (req, res) => {
    const { to, body } = req.body;

    if (!to || !body) {
        return res.status(400).json({ error: 'Faltan parámetros: "to" y "body" son requeridos.' });
    }

    const result = await sendSMS(to, body);

    if (result.success) {
        res.json({ message: 'SMS enviado correctamente', sid: result.sid });
    } else {
        res.status(500).json({ error: 'Error al enviar SMS', details: result.error });
    }
});

module.exports = router;
