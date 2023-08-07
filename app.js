// app.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Website = require('./models');


// const mongoose = require('mongoose');

const DB_URI = 'mongodb+srv://tonysoni:uYgQpWt5QnkoenSF@cluster0.ab4pjdn.mongodb.net/';

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());

// API Endpoints
// Endpoint to create/update data for a website
app.post('/api/website', async (req, res) => {
  try {
    const { url, elements } = req.body;
    // Ensure elements is an array of objects with either classname or content and icons properties
    if (!Array.isArray(elements) || !elements.every(el => el.icons)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    // Transform the elements array to ensure every element has a classname property (if content is provided)
    const transformedElements = elements.map(el => {
      const classname = el.classname || '';
      const content = el.content || '';
      return { classname, content, icons: el.icons };
    });

    // Find the website document or create a new one if it doesn't exist
    const website = await Website.findOneAndUpdate(
      { url },
      { $set: { elements: transformedElements } },
      { upsert: true, new: true }
    );

    return res.json({ website });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Endpoint to retrieve data for a website by URL
app.get('/api/website/:url', async (req, res) => {
  try {
    const { url } = req.params;
    const website = await Website.findOne({ url });

    if (!website) {
      return res.status(404).json({ error: 'Website not found' });
    }

    return res.json({ website });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
