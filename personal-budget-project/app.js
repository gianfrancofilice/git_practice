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

// Endpoint to retrieve all envelopes
app.get('/envelopes', (req, res) => {
    return res.status(200).json(envelopes);
  });

// Endpoint to retrieve a specific envelope by ID
app.get('/envelopes/:id', (req, res) => {
    const { id } = req.params;
    const envelope = envelopes.find(e => e.id === Number(id));
  
    if (!envelope) {
      return res.status(404).json({ error: `Envelope with ID ${id} not found` });
    }
  
    return res.status(200).json(envelope);
  });

app.get('/', (req, res) => {
  res.send('Hello, World');
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
