const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
const router = express.Router();






router.use(express.json({ limit: '50mb' })); // For large files
router.use(express.static(path.join(__dirname)));

// API endpoints
router.post('/upload', async (req, res) => {
  try {
    const { name, type, salt, iv, data } = req.body;
    const saltBuffer = Buffer.from(salt, 'base64');
    const ivBuffer = Buffer.from(iv, 'base64');
    const dataBuffer = Buffer.from(data, 'base64');
    const userId = 3;

    const [result] = await db.execute(
      'INSERT INTO files (name, type, salt, iv, data,userId) VALUES (?, ?, ?, ?, ?, ?)',
      [name, type, saltBuffer, ivBuffer, dataBuffer,userId]
    );

    res.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/files', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name FROM files');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

router.post('/download', async (req, res) => {
  try {
    const { id } = req.body;
    const [rows] = await db.execute('SELECT * FROM files WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const file = rows[0];
    res.json({
      name: file.name,
      type: file.type,
      salt: file.salt.toString('base64'),
      iv: file.iv.toString('base64'),
      data: file.data.toString('base64')
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Download failed' });
  }
});

module.exports = router;
