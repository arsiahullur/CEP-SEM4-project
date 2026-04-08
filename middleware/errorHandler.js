// middleware/errorHandler.js
module.exports = (err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: 'An unexpected server error occurred' });
};