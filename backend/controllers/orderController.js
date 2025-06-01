const Order = require('../models/Order');
const { sendOrderConfirmationEmail, sendTransactionFailedEmail } = require('../services/emailService');

// Create a new order
const createOrder = async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();

        // Send appropriate email based on transaction status
        try {
            if (order.transactionStatus === 'approved') {
                await sendOrderConfirmationEmail(order);
            } else {
                await sendTransactionFailedEmail(order);
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            // Don't fail the order creation if email fails
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(400).json({ message: error.message });
    }
};

// Get order by order number
const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrder
}; 