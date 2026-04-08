const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors()); // allow all origins
app.use(express.json());

// ── Serve frontend (VERY IMPORTANT) ─────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ──────────────────────────────────
const authRoutes = require('./routes/auth');
const appointmentRoutes = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const doctorRoutes = require('./routes/doctors');

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/doctors', doctorRoutes);

// ── Health check ────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'MediConnect server is running!'
  });
});

// ── Start server ────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});