const Order = require('../models/Order');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// Create new order
const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array().map((e) => e.msg),
      });
    }

    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        message: 'No products in order',
        errors: ['Order must contain at least one product'],
      });
    }

    // Calculate total price and validate products
    let totalPrice = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({
          message: `Product not found`,
          errors: [`Product with ID ${item.product} not found`],
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: 'Insufficient stock',
          errors: [`Not enough stock for ${product.name}. Available: ${product.stock}`],
        });
      }

      totalPrice += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
      });

      // Update product stock
      product.stock -= item.quantity;
      await product.save();
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalPrice,
      status: 'pending',
    });

    await order.populate('products.product');

    res.status(201).json({
      message: 'Order created successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Orders fetched successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get single order by ID
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('products.product')
      .populate('user', 'username email');

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        errors: [],
      });
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Access denied',
        errors: ['You do not have permission to view this order'],
      });
    }

    res.json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        errors: ['Status must be pending, completed, or cancelled'],
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        errors: [],
      });
    }

    order.status = status;
    await order.save();

    await order.populate('products.product');

    res.json({
      message: 'Order status updated successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
