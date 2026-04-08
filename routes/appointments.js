const router = require('express').Router();
const db = require('../db');

// BOOK APPOINTMENT
router.post('/', async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time } = req.body;
    if (!patient_id || !doctor_id || !date || !time)
      return res.status(400).json({ success: false, message: 'All fields required' });
    const [result] = await db.query(
      'INSERT INTO appointments (patient_id, doctor_id, date, time, status) VALUES (?,?,?,?,?)',
      [patient_id, doctor_id, date, time, 'pending']
    );
    res.json({ success: true, message: 'Appointment booked!', appointment_id: result.insertId });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// GET FOR PATIENT
router.get('/patient/:patient_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.date, a.time, a.status,
              d.id AS doctor_id, d.name AS doctor_name, d.specialization
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.patient_id = ?
       ORDER BY a.date DESC, a.time DESC`,
      [req.params.patient_id]
    );
    res.json({ success: true, appointments: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// GET FOR DOCTOR — includes patient_id and patient_email
router.get('/doctor/:doctor_id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.date, a.time, a.status,
              p.id AS patient_id, p.name AS patient_name, p.email AS patient_email
       FROM appointments a
       JOIN patients p ON a.patient_id = p.id
       WHERE a.doctor_id = ?
       ORDER BY a.date DESC, a.time DESC`,
      [req.params.doctor_id]
    );
    res.json({ success: true, appointments: rows });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

// UPDATE STATUS
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending','confirmed','completed','cancelled'];
    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status' });
    await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Status updated to ' + status });
  } catch (err) { res.status(500).json({ success: false, message: 'Server error' }); }
});

module.exports = router;