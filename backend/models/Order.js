const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  orderDetails: {
    items: [{
      product: {
        title: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true,
          min: 0
        },
        image: {
          type: String,
          required: true
        },
        description: String
      },
      quantity: {
        type: Number,
        required: true,
        min: 1
      },
      selectedColor: String,
      selectedSize: String
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping: {
      type: Number,
      required: true,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  customerInfo: {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
    },
    phone: {
      type: String,
      required: true,
      match: [/^\+?[\d\s-]{10,}$/, 'Please enter a valid phone number']
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    zipCode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, 'Please enter a valid 6-digit PIN code']
    }
  },
  transactionStatus: {
    type: String,
    enum: ['approved', 'declined', 'error'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update inventory
orderSchema.pre('save', async function (next) {
  if (this.transactionStatus === 'approved') {
    const Product = mongoose.model('Product');

    try {
      for (const item of this.orderDetails.items) {
        if (item.product.id) {
          const product = await Product.findById(item.product.id);
          if (!product) {
            throw new Error(`Product ${item.product.id} not found`);
          }

          if (product.inventory < item.quantity) {
            throw new Error(`Insufficient inventory for product ${item.product.id}`);
          }

          product.inventory -= item.quantity;
          await product.save();
        }
      }
    } catch (error) {
      next(error);
      return;
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);