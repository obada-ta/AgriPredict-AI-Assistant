const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    title: { type: String, required: true },
    ingredient: { type: String, required: true },
    instuctions: { type: String, required: true }, // عدل ليطابق طلبك
    time: { type: String, required: true },
    converImage: { type: String, required: true } // عدل ليطابق طلبك
}, { timestamps: true });

module.exports = mongoose.model('Recipe', recipeSchema);