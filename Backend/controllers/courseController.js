import Course from '../models/Course.js';

// @route   GET /api/courses
// @desc    Get all courses
// @access  Admin
export async function getCourses(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   GET /api/courses/:id
// @desc    Get single course
// @access  Admin
export async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   POST /api/courses
// @desc    Create new course
// @access  Admin
export async function createCourse(req, res) {
  try {
    // Replace thumbnail with images
    const { thumbnail, ...courseData } = req.body;
    const course = new Course(courseData);
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Admin
export async function updateCourse(req, res) {
  try {
    // Replace thumbnail with images
    const { thumbnail, ...courseData } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      courseData,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course updated successfully', course });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Admin
export async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}