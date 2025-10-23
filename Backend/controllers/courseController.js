import Course from '../models/Course.js';
import mongoose from 'mongoose';

// Utility to handle validation errors
const handleValidationError = (error, res) => {
    let errors = {};
    Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
    });
    return res.status(400).json({ message: "Validation Error", errors });
};

// @desc    Get all courses with filtering, sorting, pagination
// @route   GET /api/courses
// @access  Public
export const getCourses = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = Course.find({ isActive: true }); // Default to active courses for public view

        // Filtering
        if (req.query.category) {
            query = query.where('category').equals(req.query.category);
        }
        if (req.query.maxPrice) {
            query = query.where('price').lte(parseFloat(req.query.maxPrice));
             // Also consider discountPrice if applicable for filtering
             // query = query.or([{ price: { $lte: parseFloat(req.query.maxPrice) } }, { discountPrice: { $lte: parseFloat(req.query.maxPrice) } }]);
        }
        if (req.query.search) {
             query = query.where({ $text: { $search: req.query.search } }); // Requires text index on schema
            // Or use regex for simpler search:
            // const searchRegex = new RegExp(req.query.search, 'i');
            // query = query.where({ $or: [{ title: searchRegex }, { description: searchRegex }] });
        }


        // Sorting
        let sortOption = { createdAt: -1 }; // Default: newest first
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price-asc':
                    sortOption = { price: 1 };
                    break;
                case 'price-desc':
                    sortOption = { price: -1 };
                    break;
                case 'newest':
                default:
                    sortOption = { createdAt: -1 };
            }
        }
        query = query.sort(sortOption);

        // Pagination
        const totalCourses = await Course.countDocuments(query.getFilter()); // Count based on current filter
        const totalPages = Math.ceil(totalCourses / limit);
        const courses = await query.skip(skip).limit(limit);

        res.json({
            courses,
            currentPage: page,
            totalPages,
            totalCourses,
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error fetching courses' });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Public
export const getCourseById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid course ID format' });
        }
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error fetching course by ID:', error);
        res.status(500).json({ message: 'Server error fetching course' });
    }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin (Protected by verifyFirebaseToken)
export const createCourse = async (req, res) => {
    try {
        const { 
            title, 
            description, 
            price, 
            discountPrice, 
            category, 
            instructor, 
            thumbnail, 
            images, 
            level, 
            availableLevels, // <-- Destructure new field
            productType 
        } = req.body;

        // Basic validation (more comprehensive validation is in the model)
        if (!title || !description || price == null || !category) { // Check if price is provided (can be 0)
            return res.status(400).json({ message: 'Title, description, price, and category are required' });
        }

        const newCourse = new Course({
            title,
            description,
            price,
            discountPrice: discountPrice || 0,
            category,
            instructor: instructor || 'CasaDeELE Team',
            thumbnail: thumbnail || '', // Keep thumbnail if still used, otherwise remove
            images: Array.isArray(images) ? images : [], 
            level, // Keep if still relevant
            availableLevels: Array.isArray(availableLevels) ? availableLevels : [], // <-- Save as array, default empty
            productType: productType || 'Digital'
        });

        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return handleValidationError(error, res);
        }
        console.error('Error creating course:', error);
        res.status(500).json({ message: 'Server error creating course', error: error.message });
    }
};

// @desc    Update an existing course
// @route   PUT /api/courses/:id
// @access  Admin (Protected by verifyFirebaseToken)
export const updateCourse = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid course ID format' });
        }

        const { 
            title, 
            description, 
            price, 
            discountPrice, 
            category, 
            instructor, 
            thumbnail, 
            images, 
            level, 
            availableLevels, // <-- Destructure new field
            productType,
            isActive // Allow updating isActive status
         } = req.body;

        // Construct update object only with provided fields
        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (price != null) updateData.price = price; // Allow setting price to 0
        if (discountPrice != null) updateData.discountPrice = discountPrice;
        if (category) updateData.category = category;
        if (instructor) updateData.instructor = instructor;
        if (thumbnail) updateData.thumbnail = thumbnail; // Keep if used
        if (images) updateData.images = Array.isArray(images) ? images : [];
        if (level) updateData.level = level;
        if (availableLevels) updateData.availableLevels = Array.isArray(availableLevels) ? availableLevels : []; // <-- Update as array
        if (productType) updateData.productType = productType;
        if (typeof isActive === 'boolean') updateData.isActive = isActive; // Update isActive status
        
        updateData.updatedAt = Date.now(); // Manually update updatedAt if pre-save hook isn't used

        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData }, // Use $set to update only provided fields
            { new: true, runValidators: true, context: 'query' } // context needed for some validators on update
        );

        if (updatedCourse) {
            res.json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
         if (error.name === 'ValidationError') {
            return handleValidationError(error, res);
        }
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Server error updating course', error: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Admin (Protected by verifyFirebaseToken)
export const deleteCourse = async (req, res) => {
    try {
         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid course ID format' });
        }
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (deletedCourse) {
            res.json({ message: 'Course deleted successfully' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Server error deleting course' });
    }
};