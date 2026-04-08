const router = require('express').Router();
const db = require('../db');

// ── ADD PRESCRIPTION (Doctor) ─────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, appointment_id, medicine, dosage, notes } = req.body;

    if (!patient_id || !doctor_id || !medicine || !dosage)
      return res.status(400).json({ success: false, message: 'Patient, doctor, medicine and dosage are required' });

    const [result] = await db.query(
      'INSERT INTO prescriptions (patient_id, doctor_id, appointment_id, medicine, dosage, notes) VALUES (?, ?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_id || null, medicine, dosage, notes || null]
    );

    res.json({ success: true, message: 'Prescription added!', prescription_id: result.insertId });

  } catch (err) {
    console.error('Add prescription error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET PRESCRIPTIONS FOR A PATIENT ──────────────────────
router.get('/patient/:patient_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.medicine, p.dosage, p.notes, p.created_at,
              d.name AS doctor_name, d.specialization
       FROM prescriptions p
       JOIN doctors d ON p.doctor_id = d.id
       WHERE p.patient_id = ?
       ORDER BY p.created_at DESC`,
      [req.params.patient_id]
    );
    res.json({ success: true, prescriptions: rows });
  } catch (err) {
    console.error('Get patient prescriptions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET PRESCRIPTIONS WRITTEN BY A DOCTOR ────────────────
router.get('/doctor/:doctor_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.id, p.medicine, p.dosage, p.notes, p.created_at,
              pat.name AS patient_name, pat.email AS patient_email
       FROM prescriptions p
       JOIN patients pat ON p.patient_id = pat.id
       WHERE p.doctor_id = ?
       ORDER BY p.created_at DESC`,
      [req.params.doctor_id]
    );
    res.json({ success: true, prescriptions: rows });
  } catch (err) {
    console.error('Get doctor prescriptions error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;