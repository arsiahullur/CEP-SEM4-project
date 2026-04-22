const router = require('express').Router();
const bcrypt = require('bcryptjs');
const db = require('../db');

// ── PATIENT REGISTER ──────────────────────────────────────
router.post('/register/patient', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM patients WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Insert patient
    const [result] = await db.query(
      'INSERT INTO patients (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashed]
    );

    res.json({
      success: true,
      message: 'Patient registered successfully',
      user: { id: result.insertId, name, email, role: 'patient' }
    });

  } catch (err) {
  console.error('Register patient error:', err);
  res.status(500).json({ success: false, message: err.message }); // 👈 IMPORTANT
}
});

// ── DOCTOR REGISTER ───────────────────────────────────────
router.post('/register/doctor', async (req, res) => {
  try {
    const { name, email, password, specialization } = req.body;

    if (!name || !email || !password || !specialization)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const [existing] = await db.query('SELECT id FROM doctors WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(400).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      'INSERT INTO doctors (name, email, password, specialization) VALUES (?, ?, ?, ?)',
      [name, email, hashed, specialization]
    );

    res.json({
      success: true,
      message: 'Doctor registered successfully',
      user: { id: result.insertId, name, email, specialization, role: 'doctor' }
    });
  }
  catch (err) {
  console.error('Register patient error:', err);
  res.status(500).json({ success: false, message: err.message }); // 👈 IMPORTANT
}
});

// ── PATIENT LOGIN ─────────────────────────────────────────
router.post('/login/patient', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const [rows] = await db.query('SELECT * FROM patients WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const patient = rows[0];
    const match = await bcrypt.compare(password, patient.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    // Don't send password back
    const user = { id: patient.id, name: patient.name, email: patient.email, role: 'patient' };

    res.json({ success: true, message: 'Login successful', user });

} catch (err) {
  console.error('Register patient error:', err);
  res.status(500).json({ success: false, message: err.message }); // 👈 IMPORTANT
}
});

// ── DOCTOR LOGIN ──────────────────────────────────────────
router.post('/login/doctor', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    const [rows] = await db.query('SELECT * FROM doctors WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const doctor = rows[0];
    const match = await bcrypt.compare(password, doctor.password);
    if (!match)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const user = {
      id: doctor.id, name: doctor.name, email: doctor.email,
      specialization: doctor.specialization, role: 'doctor'
    };

    res.json({ success: true, message: 'Login successful', user });

  } catch (err) {
  console.error('Register patient error:', err);
  res.status(500).json({ success: false, message: err.message }); // 👈 IMPORTANT
}
});

module.exports = router;