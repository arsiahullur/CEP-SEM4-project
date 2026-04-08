const router = require('express').Router();
const db = require('../db');

// ── GET ALL DOCTORS ───────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [doctors] = await db.query(
      'SELECT id, name, email, specialization FROM doctors ORDER BY name ASC'
    );
    res.json({ success: true, doctors });
  } catch (err) {
    console.error('Get doctors error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// ── GET ONE DOCTOR ────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, specialization FROM doctors WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Doctor not found' });

    res.json({ success: true, doctor: rows[0] });
  } catch (err) {
    console.error('Get doctor error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;