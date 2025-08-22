const express = require('express');
const { body, validationResult } = require('express-validator');
const Subgroup = require('../models/Subgroup');
const College = require('../models/College');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/subgroups/recommended
// @desc    Get recommended subgroups for user
// @access  Private
router.get('/recommended', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('subgroups');
    const userSubgroupIds = user.subgroups.map(sg => sg._id);

    // Find subgroups from the same college that user hasn't joined
    const recommendedSubgroups = await Subgroup.find({
      collegeId: req.user.collegeId,
      _id: { $nin: userSubgroupIds }
    })
    .populate('collegeId', 'name domain')
    .populate('members', 'name')
    .limit(5)
    .sort({ 'members.length': -1 }); // Sort by member count

    res.json(recommendedSubgroups);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subgroups
// @desc    Get subgroups (with filtering by college)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { collegeId, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (collegeId) filter.collegeId = collegeId;

    const subgroups = await Subgroup.find(filter)
      .populate('collegeId', 'name domain')
      .populate('members', 'name email role')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Subgroup.countDocuments(filter);

    res.json({
      subgroups,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalSubgroups: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subgroups/:id
// @desc    Get subgroup by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const subgroup = await Subgroup.findById(req.params.id)
      .populate('collegeId', 'name domain')
      .populate('members', 'name email role')
      .populate('posts.author', 'name email');

    if (!subgroup) {
      return res.status(404).json({ message: 'Subgroup not found' });
    }

    // Sort posts by pinned first, then by date
    subgroup.posts.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(subgroup);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subgroups
// @desc    Create new subgroup
// @access  Private
router.post('/', [
  auth,
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    // Check if subgroup with same name exists in the college
    const existingSubgroup = await Subgroup.findOne({
      name,
      collegeId: req.user.collegeId
    });

    if (existingSubgroup) {
      return res.status(400).json({
        message: 'Subgroup with this name already exists in your college'
      });
    }

    const subgroup = new Subgroup({
      name,
      description,
      collegeId: req.user.collegeId,
      members: [req.user._id]
    });

    await subgroup.save();

    // Add subgroup to college
    await College.findByIdAndUpdate(
      req.user.collegeId,
      { $push: { subgroups: subgroup._id } }
    );

    // Add subgroup to user's subgroups
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subgroups: subgroup._id } }
    );

    const populatedSubgroup = await Subgroup.findById(subgroup._id)
      .populate('collegeId', 'name domain')
      .populate('members', 'name email role');

    res.status(201).json({
      message: 'Subgroup created successfully',
      subgroup: populatedSubgroup
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subgroups/:id/join
// @desc    Join subgroup
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const subgroup = await Subgroup.findById(req.params.id);
    if (!subgroup) {
      return res.status(404).json({ message: 'Subgroup not found' });
    }

    // Check if user is from the same college
    if (subgroup.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({
        message: 'You can only join subgroups from your college'
      });
    }

    // Check if user is already a member
    if (subgroup.members.includes(req.user._id)) {
      return res.status(400).json({
        message: 'You are already a member of this subgroup'
      });
    }

    // Add user to subgroup
    subgroup.members.push(req.user._id);
    await subgroup.save();

    // Add subgroup to user's subgroups
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { subgroups: subgroup._id } }
    );

    res.json({ message: 'Successfully joined the subgroup' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/subgroups/:id/leave
// @desc    Leave subgroup
// @access  Private
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const subgroup = await Subgroup.findById(req.params.id);
    if (!subgroup) {
      return res.status(404).json({ message: 'Subgroup not found' });
    }

    // Check if user is a member
    if (!subgroup.members.includes(req.user._id)) {
      return res.status(400).json({
        message: 'You are not a member of this subgroup'
      });
    }

    // Remove user from subgroup
    subgroup.members = subgroup.members.filter(
      member => member.toString() !== req.user._id.toString()
    );
    await subgroup.save();

    // Remove subgroup from user's subgroups
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { subgroups: subgroup._id } }
    );

    res.json({ message: 'Successfully left the subgroup' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/subgroups/:id/posts
// @desc    Create post in subgroup
// @access  Private (Members only)
router.post('/:id/posts', [
  auth,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('content').trim().isLength({ min: 5 }).withMessage('Content must be at least 5 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const subgroup = await Subgroup.findById(req.params.id);
    if (!subgroup) {
      return res.status(404).json({ message: 'Subgroup not found' });
    }

    // Check if user is a member
    if (!subgroup.members.includes(req.user._id)) {
      return res.status(403).json({
        message: 'You must be a member to post in this subgroup'
      });
    }

    const { title, content, isPinned = false } = req.body;

    const newPost = {
      title,
      content,
      author: req.user._id,
      isPinned: req.user.role === 'faculty' || req.user.role === 'admin' ? isPinned : false
    };

    subgroup.posts.push(newPost);
    await subgroup.save();

    const populatedSubgroup = await Subgroup.findById(subgroup._id)
      .populate('posts.author', 'name email role');

    const createdPost = populatedSubgroup.posts[populatedSubgroup.posts.length - 1];

    res.status(201).json({
      message: 'Post created successfully',
      post: createdPost
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
