const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs').promises;
const path = require('path');

// Create Nodemailer transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
    }
});

// Read and compile email templates
const getTemplate = async (templateName) => {
    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    const template = await fs.readFile(templatePath, 'utf-8');
    return handlebars.compile(template);
};

const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const sendOrderConfirmationEmail = async (order) => {
    try {
        const template = await getTemplate('orderConfirmation');
        const htmlContent = template({
            ...order,
            orderDate: formatDate(order.createdAt)
        });

        await transporter.sendMail({
            from: '"e-SalesOne" <noreply@esalesone.com>',
            to: order.customerInfo.email,
            subject: 'Order Confirmation - Your Order Has Been Received',
            html: htmlContent
        });

        console.log(`Order confirmation email sent to ${order.customerInfo.email}`);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw error;
    }
};

const sendTransactionFailedEmail = async (order) => {
    try {
        const template = await getTemplate('transactionFailed');
        const htmlContent = template({
            ...order,
            orderDate: formatDate(order.createdAt)
        });

        await transporter.sendMail({
            from: '"e-SalesOne" <noreply@esalesone.com>',
            to: order.customerInfo.email,
            subject: 'Transaction Failed - Action Required',
            html: htmlContent
        });

        console.log(`Transaction failed email sent to ${order.customerInfo.email}`);
    } catch (error) {
        console.error('Error sending transaction failed email:', error);
        throw error;
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendTransactionFailedEmail
}; 