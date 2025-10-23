import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import Order from '../models/Order.js'; // Ensure Order model is correctly imported and matches the structure used below
import crypto from 'crypto';
import mongoose from 'mongoose'; // Needed for ID validation and getOrderById

dotenv.config(); // Load environment variables

// Initialize Razorpay instance
let razorpay;
try {
    // Ensure keys are present before initializing
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        console.error("Backend Error: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing in environment variables. Payment processing cannot start.");
        // Optionally throw an error or handle this state
    } else {
        razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
        console.log("Razorpay initialized successfully."); // Confirmation log
    }
} catch (initError) {
    console.error("Backend Error: Failed to initialize Razorpay. Check API keys and configuration.", initError);
    // Handle initialization error appropriately
}


// Utility to handle Mongoose validation errors
const handleValidationError = (error, res) => {
    let errors = {};
    Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
    });
    console.error("Backend: Mongoose Validation Error:", errors); // Log validation errors
    return res.status(400).json({ success: false, message: "Validation Error", errors });
};


// @desc    Create Razorpay Order
// @route   POST /api/orders
// @access  Public (Consider adding auth middleware if users must be logged in)
export const createOrder = async (req, res) => {
    console.log("Backend: Received POST /api/orders request");

    // Check if Razorpay initialized correctly before proceeding
    if (!razorpay) {
        console.error("Backend: Attempted to create order, but Razorpay is not initialized.");
        return res.status(500).json({ success: false, message: 'Razorpay service is not available. Check server configuration.' });
    }

    try {
        const { amount, currency } = req.body;

        // --- Input Validation ---
        const numericAmount = Number(amount);
        if (amount == null || isNaN(numericAmount) || numericAmount <= 0) {
            console.error("Backend: Invalid amount received for order creation:", amount);
            return res.status(400).json({ success: false, message: 'Invalid amount provided. Amount must be a positive number representing the smallest currency unit (e.g., paise).' });
        }
        // --- End Validation ---

        const options = {
            amount: Math.round(numericAmount), // Ensure amount is integer (paise)
            currency: currency || 'INR',
            // Shorter, unique receipt ID
            receipt: `order_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`, // e.g., order_1761..._a4b1c3d0
        };

        console.log("Backend: Creating Razorpay order with options:", options);
        const order = await razorpay.orders.create(options);
        console.log("Backend: Razorpay order created successfully:", order);

        if (!order || !order.id) {
             console.error("Backend: Razorpay order creation response missing 'id':", order);
            return res.status(500).json({ success: false, message: 'Razorpay order creation failed (missing order ID)' });
        }

        res.status(200).json({
            success: true,
            order, // Send the full order object returned by Razorpay
            keyId: process.env.RAZORPAY_KEY_ID, // Send key ID to frontend
        });

    } catch (error) {
        console.error('Backend: Error creating Razorpay order:', error);
        const errorMessage = error.error?.description || error.message || 'Unknown server error';
        // Use status code from Razorpay error if available, otherwise default to 500
        res.status(error.statusCode || 500).json({
            success: false,
            message: `Server error creating Razorpay order: ${errorMessage}`,
            error: error.error // Send detailed error info if available
        });
    }
};

// @desc    Verify Razorpay Payment and Create Order in DB
// @route   POST /api/orders/verify
// @access  Public
export const verifyPayment = async (req, res) => {
    console.log("Backend: Received POST /api/orders/verify request");
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            billingDetails,
            cartItems,
            totalAmount // This should be the final amount charged by Razorpay (in currency unit, e.g., INR)
        } = req.body;

        // --- Input Validation ---
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !billingDetails || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || totalAmount == null || isNaN(totalAmount)) {
             console.error("Backend: Missing or invalid data in verification request body:", { razorpay_order_id, razorpay_payment_id, razorpay_signature, billingDetailsExists: !!billingDetails, cartItemsExists: !!cartItems, totalAmount });
            return res.status(400).json({ success: false, message: 'Missing or invalid payment verification details or order data.' });
        }
        // Basic validation for billingDetails (add more specific checks if needed)
         if (!billingDetails.firstName || !billingDetails.lastName || !billingDetails.email || !billingDetails.phone || !billingDetails.address || !billingDetails.city || !billingDetails.postalCode || !billingDetails.country) {
            console.error("Backend: Incomplete billing details received during verification:", billingDetails);
            return res.status(400).json({ success: false, message: 'Incomplete billing details provided.' });
        }
        // --- End Validation ---

        const body = razorpay_order_id + '|' + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        console.log("Backend: Received Signature:", razorpay_signature);
        console.log("Backend: Expected Signature:", expectedSignature);

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            console.log("Backend: Payment Signature Verified.");

            // Check if order already exists for this payment_id to prevent duplicates
            const existingOrder = await Order.findOne({ 'paymentResult.id': razorpay_payment_id });
            if (existingOrder) {
                console.warn("Backend: Order already exists for payment ID:", razorpay_payment_id, "Existing Order ID:", existingOrder._id);
                 return res.status(200).json({
                    success: true,
                    message: 'Payment previously verified and order exists.',
                    orderId: existingOrder._id
                });
            }

            // --- Prepare Order Data for DB ---
            const orderItems = cartItems.map(item => {
                // Determine itemModel based on presence of unique fields if itemType isn't passed reliably
                const itemModel = item.itemType === 'course' ? 'Course' : (item.itemType === 'product' ? 'Product' : (item.title ? 'Course' : 'Product')); // Infer if necessary
                return {
                    name: item.title || item.name || 'Item',
                    qty: item.quantity || 1,
                    price: Number(item.discountPrice || item.price || 0),
                    product: item._id, // Link to Product/Course ObjectId
                    itemModel: itemModel, // 'Course' or 'Product'
                    selectedLevel: item.selectedLevel,
                    selectedFormat: item.selectedFormat,
                };
            });

            // Recalculate itemsPrice on backend for security
            const calculatedItemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
            const calculatedTotalPrice = Number(totalAmount); // Use the amount confirmed by payment gateway

            const newOrder = new Order({
                // user: req.user?._id, // Assign user if auth is implemented
                orderItems,
                shippingAddress: { // Map billingDetails
                    fullName: `${billingDetails.firstName} ${billingDetails.lastName}`,
                    address: billingDetails.address,
                    city: billingDetails.city,
                    state: billingDetails.state || '',
                    postalCode: billingDetails.postalCode,
                    country: billingDetails.country,
                    phone: billingDetails.phone,
                    email: billingDetails.email,
                },
                paymentMethod: 'Razorpay',
                paymentResult: {
                    id: razorpay_payment_id,
                    status: 'completed',
                    update_time: new Date().toISOString(),
                    email_address: billingDetails.email
                },
                itemsPrice: calculatedItemsPrice,
                taxPrice: 0, // Implement tax calculation if needed
                shippingPrice: 0, // Implement shipping calculation if needed
                totalPrice: calculatedTotalPrice,
                isPaid: true,
                paidAt: new Date(),
                razorpayOrderId: razorpay_order_id,
                // isDelivered, deliveredAt can be added/updated later
            });

            const savedOrder = await newOrder.save(); // Save to database
            console.log("Backend: Order saved to database successfully. Order ID:", savedOrder._id);

            // --- Potentially send confirmation email here ---

            res.status(201).json({ // Use 201 Created status for new resource
                success: true,
                message: 'Payment verified successfully and order created.',
                orderId: savedOrder._id // Send your DB Order ID back
            });
        } else {
             console.error("Backend: Payment Signature Verification Failed. Received:", razorpay_signature, "Expected:", expectedSignature);
            res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
        }
    } catch (error) {
        console.error('Backend: Error during payment verification or order saving:', error);
         if (error.name === 'ValidationError') { // Handle Mongoose validation errors
            return handleValidationError(error, res);
        }
        res.status(500).json({
            success: false,
            message: 'Server error during payment verification or order creation',
            error: error.message
        });
    }
};


// @desc    Get orders (all for admin, user's own if not admin - requires auth)
// @route   GET /api/orders
// @access  Admin (Protected by verifyFirebaseToken in routes)
export const getOrders = async (req, res) => {
    try {
        // Find all orders for admin, sort by newest first
        // If implementing user orders, filter by user ID: Order.find({ user: req.user._id })
        const orders = await Order.find({})
                                .sort({ createdAt: -1 })
                                .populate('orderItems.product', 'name title'); // Populate basic product/course info
                                // Add .populate('user', 'id name email') if user association exists

        res.json(orders);
    } catch (error) {
        console.error('Backend: Error fetching orders:', error);
        res.status(500).json({ message: 'Server error fetching orders', error: error.message });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Admin (Protected by verifyFirebaseToken in routes)
export const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        // Populate more details if needed
        const order = await Order.findById(req.params.id)
                                 .populate('orderItems.product', 'name title price imageUrl images');
                                // .populate('user', 'name email'); 

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Backend: Error fetching order by ID:', error);
        res.status(500).json({ message: 'Server error fetching order', error: error.message });
    }
};

// @desc    Update order status (e.g., mark as delivered)
// @route   PUT /api/orders/:id
// @access  Admin (Protected by verifyFirebaseToken in routes)
export const updateOrder = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        
        const order = await Order.findById(req.params.id);

        if (order) {
            // Example: Update delivery status based on request body
            const { isDelivered } = req.body; 

            if (typeof isDelivered === 'boolean') {
                 order.isDelivered = isDelivered;
                 order.deliveredAt = isDelivered ? Date.now() : null; // Set/clear delivery date
                 const updatedOrder = await order.save();
                 console.log("Backend: Order updated:", updatedOrder._id, "isDelivered:", updatedOrder.isDelivered);
                 res.json(updatedOrder);
            } else {
                 // If no specific update action provided, just return the order
                 console.log("Backend: updateOrder called without specific action for ID:", req.params.id);
                 res.json(order);
            }

        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Backend: Error updating order:', error);
         if (error.name === 'ValidationError') { 
            return handleValidationError(error, res);
        }
        res.status(500).json({ message: 'Server error updating order', error: error.message });
    }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Admin (Protected by verifyFirebaseToken in routes)
export const deleteOrder = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid order ID format' });
        }
        const order = await Order.findByIdAndDelete(req.params.id);

        if (order) {
            console.log("Backend: Order deleted:", req.params.id);
            res.json({ success: true, message: 'Order removed' }); // Send success status
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        console.error('Backend: Error deleting order:', error);
        res.status(500).json({ success: false, message: 'Server error deleting order', error: error.message });
    }
};