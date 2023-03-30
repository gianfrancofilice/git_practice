const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const port = 3000;

// Global variables
let envelopes = [];
let totalBudget = 0;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Endpoint to create a new envelope
app.post('/envelopes', (req, res) => {
  const { title, budget } = req.body;

  if (!title || !budget) {
    return res.status(400).json({ error: 'Title and budget are required' });
  }

  const id = envelopes.length + 1;
  const envelope = { id, title, budget };
  envelopes.push(envelope);
  totalBudget += budget;

  return res.status(201).json({ message: 'Envelope created successfully', envelope });
});

app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
