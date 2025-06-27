import mongoose from 'mongoose';

const mealPlanSchema = new mongoose.Schema({
  name: String,
  date: String,
  recipe_ids: String,
  notes: String,
});

export default mongoose.model('MealPlan', mealPlanSchema);
