const mongoose = require('mongoose');
const securityHeaders = require('./config/security');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Add security headers middleware
app.use((req, res, next) => {
    Object.keys(securityHeaders).forEach(headerKey => {
        res.setHeader(headerKey, securityHeaders[headerKey]);
    });
    next();
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = mongoose.model("Category", categorySchema);