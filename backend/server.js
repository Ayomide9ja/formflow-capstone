process.exit(1);
const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'db',
  database: 'formflow',
  password: process.env.DB_PASSWORD,
  port: 5432,
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend is running and connected!' });
});

app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});