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

// Endpoint to update a specific envelope by ID
app.put('/envelopes/:id', (req, res) => {
    const { id } = req.params;
    const { title, budget } = req.body;
    const envelope = envelopes.find(e => e.id === Number(id));
  
    if (!envelope) {
      return res.status(404).json({ error: `Envelope with ID ${id} not found` });
    }
  
    const updatedEnvelope = { ...envelope, title, budget };
    const envelopeIndex = envelopes.findIndex(e => e.id === Number(id));
    envelopes[envelopeIndex] = updatedEnvelope;
  
    return res.status(200).json({ message: `Envelope with ID ${id} updated successfully`, envelope: updatedEnvelope });
  });

// Endpoint to delete a specific envelope by ID
app.delete('/envelopes/:id', (req, res) => {
    const { id } = req.params;
    const envelopeIndex = envelopes.findIndex(e => e.id === Number(id));
  
    if (envelopeIndex === -1) {
      return res.status(404).json({ error: `Envelope with ID ${id} not found` });
    }
  
    const deletedEnvelope = envelopes.splice(envelopeIndex, 1)[0];
    totalBudget -= deletedEnvelope.budget;
  
    return res.status(200).json({ message: `Envelope with ID ${id} deleted successfully`, envelope: deletedEnvelope });
  });

// Endpoint to transfer funds from one envelope to another
app.post('/envelopes/transfer/:from/:to', (req, res) => {
    const { from, to } = req.params;
    const { amount } = req.body;
  
    // Find the envelopes to transfer funds from and to
    const fromEnvelope = envelopes.find(e => e.id === Number(from));
    const toEnvelope = envelopes.find(e => e.id === Number(to));
  
    // Check if both envelopes exist
    if (!fromEnvelope || !toEnvelope) {
      return res.status(404).json({ error: 'Both envelopes must exist' });
    }
  
    // Check if there is enough money in the 'from' envelope
    if (fromEnvelope.budget < amount) {
        return res.status(400).json({ error: 'Not enough funds in envelope to transfer' });
        }
        
        // Transfer the funds
        fromEnvelope.budget -= amount;
        toEnvelope.budget += amount;
        
        return res.status(200).json({ message: Transferred ${amount} from envelope ${fromEnvelope.title} to envelope ${toEnvelope.title}, envelopes });
        });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
