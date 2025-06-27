import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

import recipeRoutes from './routes/recipes.dataapi.js';
import mealPlanRoutes from './routes/mealPlans.dataapi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: 'https://share-location-three.vercel.app' }));

// Rutas usando lógica basada en la Data API (sin mongoose)
app.use('/api/recipes', recipeRoutes);
app.use('/api/meal-plans', mealPlanRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
