const express = require('express');
const router = express.Router();
const restricted = require('../auth/authMiddleware.js');
const Categories = require('./categoriesModel.js');

/* General Categories' Endpoints */

// GET api/categories/
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the Categories Router! 🗃️' });
});

// GET /api/categories/all
router.get('/all', restricted, (req, res) => {
  Categories.getCategories()
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: 'Failed to retrieve categories',
      });
    });
});

// POST /api/categories
// Add a new category
// Returns all of the categories
router.post('/', restricted, (req, res) => {
  const category = req.body; // Needs 'title' and optionally, 'description'
  Categories.addCategory(category)
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to add category ${category.title}`,
      });
    });
});

// PUT /api/categories/:category_id
router.put('/:category_id', restricted, (req, res) => {
  const new_info = req.body;
  const id = req.params.category_id;
  Categories.updateCategory(id, new_info)
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to update category with id ${id}.`,
      });
    });
});

// DEL /api/categories/:category_id
router.delete('/:category_id', restricted, (req, res) => {
  const id = req.params.category_id;
  Categories.removeCategory(id)
    .then((categories) => {
      res.status(200).json(categories);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        message: `Failed to delete category with id ${id}.`,
      });
    });
});
module.exports = router;
