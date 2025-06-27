import MealPlan from '../models/MealPlan.js';

export const getAllMealPlans = async (req, res) => {
  const mealPlans = await MealPlan.find();
  res.json(mealPlans);
};

export const createMealPlan = async (req, res) => {
  const mealPlan = new MealPlan(req.body);
  await mealPlan.save();
  res.status(201).json(mealPlan);
};

export const deleteMealPlan = async (req, res) => {
  const result = await MealPlan.findByIdAndDelete(req.params.id);
  if (!result) return res.status(400).json({ error: 'Meal plan not found' });
  res.json({ message: 'Meal plan deleted successfully' });
};
