import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_URL = process.env.DATA_API_URL;
const API_KEY = process.env.MONGODB_DATA_API_KEY;
const DATA_SOURCE = process.env.DATA_SOURCE;
const DB_NAME = process.env.DB_NAME;

// POST: Crear receta
router.post('/', async (req, res) => {
  const { name, category, instructions, ingredients, prep_time } = req.body;

  const body = {
    dataSource: DATA_SOURCE,
    database: DB_NAME,
    collection: 'recipes',
    document: {
      name,
      category,
      instructions,
      ingredients,
      prep_time,
    },
  };

  try {
    const response = await fetch(`${API_URL}/action/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        'apiKey': API_KEY,
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

// GET: Obtener todas las recetas, con filtrado opcional por categoría
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.query.category) {
      filter = { category: req.query.category };
    }

    const body = {
      dataSource: DATA_SOURCE,
      database: DB_NAME,
      collection: 'recipes',
      filter,
    };

    const response = await fetch(`${API_URL}/action/find`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        'apiKey': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const result = await response.json();
    res.json(result.documents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// DELETE: Eliminar receta por id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  // MongoDB Data API requiere _id como objeto BSON ObjectId
  const body = {
    dataSource: DATA_SOURCE,
    database: DB_NAME,
    collection: 'recipes',
    filter: {
      _id: { $oid: id }
    },
  };

  try {
    const response = await fetch(`${API_URL}/action/deleteOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/ejson',
        'apiKey': API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const result = await response.json();

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json({ message: 'Recipe deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

export default router;
