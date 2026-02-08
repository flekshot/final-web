const express = require('express');
const { body } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - Public
router.get('/', getProducts);

// GET /api/products/:id - Public
router.get('/:id', getProductById);

// POST /api/products - Admin only
router.post(
  '/',
  auth,
  adminAuth,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('stock').isNumeric().withMessage('Stock must be a number'),
  ],
  createProduct
);

// PUT /api/products/:id - Admin only
router.put('/:id', auth, adminAuth, updateProduct);

// DELETE /api/products/:id - Admin only
router.delete('/:id', auth, adminAuth, deleteProduct);

module.exports = router;
