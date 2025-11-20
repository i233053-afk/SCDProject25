const express = require('express');
const db = require('./db');
const app = express();
const PORT = 3000;

// -----------------------------
// Middleware
// -----------------------------
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse URL-encoded bodies
app.use(express.static('public')); // serve frontend files

// -----------------------------
// Routes
// -----------------------------

// Add Record
app.post('/records', (req, res) => {
  const { name, value } = req.body;
  if (!name || !value) {
    return res.status(400).json({ message: 'Name and value are required.' });
  }
  db.addRecord({ name, value });
  res.json({ message: 'Record added successfully!' });
});

// List Records
app.get('/records', (req, res) => {
  res.json(db.listRecords());
});

// Update Record
app.put('/records/:id', (req, res) => {
  const { name, value } = req.body;
  if (!name || !value) {
    return res.status(400).json({ message: 'Name and value are required.' });
  }
  const updated = db.updateRecord(Number(req.params.id), name, value);
  res.json(updated ? { message: 'Record updated!' } : { message: 'Record not found.' });
});

// Delete Record
app.delete('/records/:id', (req, res) => {
  const deleted = db.deleteRecord(Number(req.params.id));
  res.json(deleted ? { message: 'Record deleted!' } : { message: 'Record not found.' });
});

// Search Records
app.get('/records/search', (req, res) => {
  const keyword = req.query.keyword || '';
  const results = db.listRecords().filter(r =>
    r.name.toLowerCase().includes(keyword.toLowerCase()) ||
    r.id.toString().includes(keyword)
  );
  res.json(results);
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`NodeVault API running on http://localhost:${PORT}`);
});

