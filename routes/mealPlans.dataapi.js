import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.MONGODB_DATA_API_KEY;
const DATA_SOURCE = process.env.DATA_SOURCE;
const DB_NAME = process.env.DB_NAME;

// GET all meal plans
router.get('/', async (req, res) => {
  const body = {
    dataSource: DATA_SOURCE,
    database: DB_NAME,
    collection: 'mealPlans',
  };

  try {
    const response = await fetch(`${API_URL}/action/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        apiKey: API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    res.json(result.documents || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
});

// POST create a new meal plan
router.post('/', async (req, res) => {
  const { name, date, recipe_ids, notes } = req.body;

  const body = {
    dataSource: DATA_SOURCE,
    database: DB_NAME,
    collection: 'mealPlans',
    document: {
      name,
      date,
      recipe_ids,
      notes,
    },
  };

  try {
    const response = await fetch(`${API_URL}/action/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        apiKey: API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save meal plan' });
  }
});

// DELETE meal plan by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  const body = {
    dataSource: DATA_SOURCE,
    database: DB_NAME,
    collection: 'mealPlans',
    filter: { _id: { $oid: id } },
  };

  try {
    const response = await fetch(`${API_URL}/action/deleteOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        apiKey: API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (result.deletedCount === 0) {
      return res.status(400).json({ error: 'Meal plan not found' });
    }

    res.json({ message: 'Meal plan deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
});

export default router;
