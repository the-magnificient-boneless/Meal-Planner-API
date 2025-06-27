import Recipe from '../models/Recipe.js';

export const getAllRecipes = async (req, res) => {
  const query = req.query.category ? { category: req.query.category } : {};
  const recipes = await Recipe.find(query);
  res.json(recipes);
};

export const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
  res.json(recipe);
};

export const createRecipe = async (req, res) => {
  const recipe = new Recipe(req.body);
  await recipe.save();
  res.status(201).json(recipe);
};
