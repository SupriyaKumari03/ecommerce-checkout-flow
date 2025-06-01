const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// Email templates
const getEmailTemplate = (order, isSuccess) => {
  if (isSuccess) {
    return {
      subject: `Order Confirmation - Order #${order.orderNumber}`,
      html: `
        <h1>Thank you for your order!</h1>
        <p>Your order has been successfully processed.</p>
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        ${order.orderDetails.items.map(item => `
          <div style="margin-bottom: 15px;">
            <p><strong>Product:</strong> ${item.product.title}</p>
            <p><strong>Color:</strong> ${item.selectedColor}</p>
            <p><strong>Size:</strong> ${item.selectedSize}</p>
            <p><strong>Quantity:</strong> ${item.quantity}</p>
            <p><strong>Price:</strong> $${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
        `).join('')}
        <p><strong>Subtotal:</strong> $${order.orderDetails.subtotal.toFixed(2)}</p>
        <p><strong>Shipping:</strong> ${order.orderDetails.shipping === 0 ? 'Free' : `$${order.orderDetails.shipping.toFixed(2)}`}</p>
        <p><strong>Total:</strong> $${order.orderDetails.total.toFixed(2)}</p>
        <h2>Shipping Information</h2>
        <p>${order.customerInfo.fullName}</p>
        <p>${order.customerInfo.address}</p>
        <p>${order.customerInfo.city}, ${order.customerInfo.state} ${order.customerInfo.zipCode}</p>
        <p>We'll notify you when your order ships.</p>
      `
    };
  } else {
    return {
      subject: `Transaction Failed - Order #${order.orderNumber}`,
      html: `
        <h1>Transaction Failed</h1>
        <p>We were unable to process your payment for the following order:</p>
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        ${order.orderDetails.items.map(item => `
          <p><strong>Product:</strong> ${item.product.title}</p>
        `).join('')}
        <p><strong>Total:</strong> $${order.orderDetails.total.toFixed(2)}</p>
        <p>Please try again with a different payment method or contact our support team for assistance.</p>
        <p>Support: support@example.com</p>
      `
    };
  }
};

// Create new order
router.post('/', async (req, res) => {
  try {
    console.log('Received order request:', JSON.stringify(req.body, null, 2));

    // Validate required fields
    if (!req.body.orderDetails || !req.body.customerInfo) {
      console.error('Missing required fields:', {
        hasOrderDetails: !!req.body.orderDetails,
        hasCustomerInfo: !!req.body.customerInfo
      });
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check inventory availability before creating order
    if (!req.body.orderDetails.items || !Array.isArray(req.body.orderDetails.items)) {
      console.error('Invalid items array:', req.body.orderDetails.items);
      return res.status(400).json({ message: 'Invalid items format' });
    }

    // Modify the order data to handle products without MongoDB IDs
    const modifiedOrderData = {
      ...req.body,
      orderDetails: {
        ...req.body.orderDetails,
        items: req.body.orderDetails.items.map(item => ({
          ...item,
          product: {
            ...item.product,
            // Remove id if it's not a valid MongoDB ObjectId
            id: mongoose.isValidObjectId(item.product.id) ? item.product.id : undefined
          }
        }))
      }
    };

    // For demo purposes, skip product validation if we're in development
    if (process.env.NODE_ENV !== 'development') {
      for (const item of modifiedOrderData.orderDetails.items) {
        if (item.product.id) {
          const product = await Product.findById(item.product.id);
          if (!product) {
            console.error(`Product not found: ${item.product.id}`);
            return res.status(400).json({ message: `Product ${item.product.id} not found` });
          }
          if (product.inventory < item.quantity) {
            console.error(`Insufficient inventory for product: ${product.title}`);
            return res.status(400).json({ message: `Insufficient inventory for ${product.title}` });
          }
        }
      }
    }

    const order = new Order(modifiedOrderData);
    console.log('Created order object:', JSON.stringify(order, null, 2));

    await order.save();
    console.log('Order saved successfully');

    // Send email based on transaction status
    const isSuccess = order.transactionStatus === 'approved';
    const emailTemplate = getEmailTemplate(order, isSuccess);

    if (process.env.MAILTRAP_USER && process.env.MAILTRAP_PASS) {
      await transporter.sendMail({
        from: '"E-commerce Store" <noreply@example.com>',
        to: order.customerInfo.email,
        ...emailTemplate
      });
      console.log('Confirmation email sent');
    } else {
      console.log('Skipping email send - no email credentials configured');
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(400).json({
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get order by order number
router.get('/:orderNumber', async (req, res) => {
  try {
    console.log('Looking for order:', req.params.orderNumber);
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) {
      console.log('Order not found:', req.params.orderNumber);
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('Found order:', order);
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;