import Subscriber from '../models/Subscriber.js';

// @route   GET /api/subscribers
// @desc    Get all subscribers
// @access  Admin
export async function getSubscribers(req, res) {
  try {
    const { 
      page = 1, 
      limit = 10, 
      isActive,
      search,
      sortBy = 'subscribedAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const subscribers = await Subscriber.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Subscriber.countDocuments(query);

    res.status(200).json({
      subscribers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   GET /api/subscribers/:id
// @desc    Get single subscriber
// @access  Admin
export async function getSubscriberById(req, res) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.status(200).json(subscriber);
  } catch (error) {
    console.error('Error fetching subscriber:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   POST /api/subscribers
// @desc    Create new subscriber
// @access  Admin
export async function createSubscriber(req, res) {
  try {
    const subscriber = new Subscriber(req.body);
    await subscriber.save();
    res.status(201).json({ message: 'Subscriber created successfully', subscriber });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subscriber with this email already exists' });
    }
    console.error('Error creating subscriber:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   PUT /api/subscribers/:id
// @desc    Update subscriber
// @access  Admin
export async function updateSubscriber(req, res) {
  try {
    const subscriber = await Subscriber.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.status(200).json({ message: 'Subscriber updated successfully', subscriber });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subscriber with this email already exists' });
    }
    console.error('Error updating subscriber:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   DELETE /api/subscribers/:id
// @desc    Delete subscriber
// @access  Admin
export async function deleteSubscriber(req, res) {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

// @route   PUT /api/subscribers/:id/unsubscribe
// @desc    Unsubscribe user
// @access  Admin
export async function unsubscribeUser(req, res) {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    
    subscriber.isActive = false;
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();
    
    res.status(200).json({ 
      message: 'User unsubscribed successfully', 
      subscriber 
    });
  } catch (error) {
    console.error('Error unsubscribing user:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}
