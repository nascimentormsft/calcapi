'use strict';

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

// Serve the OpenAPI specification
app.get('/calcapi.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'calcapi.json'));
});

/**
 * Parses and validates that both query/body parameters are integers.
 * Returns { a, b } or throws with a 400 response.
 */
function parseIntegers(raw_a, raw_b, res) {
  const a = Number(raw_a);
  const b = Number(raw_b);

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    res.status(400).json({ error: 'Parameters a and b must be integers.' });
    return null;
  }
  return { a, b };
}

// GET /add?a=&b=
app.get('/add', (req, res) => {
  const parsed = parseIntegers(req.query.a, req.query.b, res);
  if (!parsed) return;
  const { a, b } = parsed;
  res.json({ operation: 'add', a, b, result: a + b });
});

// GET /subtract?a=&b=
app.get('/subtract', (req, res) => {
  const parsed = parseIntegers(req.query.a, req.query.b, res);
  if (!parsed) return;
  const { a, b } = parsed;
  res.json({ operation: 'subtract', a, b, result: a - b });
});

// GET /multiply?a=&b=
app.get('/multiply', (req, res) => {
  const parsed = parseIntegers(req.query.a, req.query.b, res);
  if (!parsed) return;
  const { a, b } = parsed;
  res.json({ operation: 'multiply', a, b, result: a * b });
});

// GET /divide?a=&b=
app.get('/divide', (req, res) => {
  const parsed = parseIntegers(req.query.a, req.query.b, res);
  if (!parsed) return;
  const { a, b } = parsed;
  if (b === 0) {
    return res.status(400).json({ error: 'Division by zero is not allowed.' });
  }
  res.json({ operation: 'divide', a, b, result: a / b });
});

app.listen(PORT, () => {
  console.log(`calcapi listening on port ${PORT}`);
});
