const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app = express();

// ── Allow requests from ANY origin (fixes port 5500 → 5000 issue) ──
app.use(cors({
  origin: '*',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(express.json());

// Serve all HTML/CSS/JS files from /public
app.use(express.static('public'));

// ── Routes ──────────────────────────────────────────────
const authRoutes         = require('./routes/auth');
const appointmentRoutes  = require('./routes/appointments');
const prescriptionRoutes = require('./routes/prescriptions');
const doctorRoutes       = require('./routes/doctors');

app.use('/api/auth',          authRoutes);
app.use('/api/appointments',  appointmentRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/doctors',       doctorRoutes);

// ── Health check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MediConnect server is running!' });
});

// ── Start ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/api/health`);
});