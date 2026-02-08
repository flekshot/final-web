const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/orders - Create order (authenticated users)
router.post(
  '/',
  auth,
  [
    body('products').isArray({ min: 1 }).withMessage('Products array is required'),
    body('products.*.product').notEmpty().withMessage('Product ID is required'),
    body('products.*.quantity')
      .isInt({ min: 1 })
      .withMessage('Quantity must be at least 1'),
  ],
  createOrder
);

// GET /api/orders/my - Get current user's orders
router.get('/my', auth, getMyOrders);

// GET /api/orders/:id - Get single order (owner or admin)
router.get('/:id', auth, getOrderById);

// PUT /api/orders/:id/status - Update order status (admin only)
router.put('/:id/status', auth, adminAuth, updateOrderStatus);

module.exports = router;
