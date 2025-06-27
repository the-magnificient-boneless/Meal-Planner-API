import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
  name: String,
  category: String,
  instructions: String,
  ingredients: String,
  prep_time: Number,
});

export default mongoose.model('Recipe', recipeSchema);
