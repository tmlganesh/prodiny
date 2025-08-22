const express = require('express');
const { body, validationResult } = require('express-validator');
const College = require('../models/College');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/colleges
// @desc    Get all colleges
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { domain: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const colleges = await College.find(filter)
      .populate('subgroups', 'name description')
      .populate('projects', 'title status createdAt')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ name: 1 });

    const total = await College.countDocuments(filter);

    res.json({
      colleges,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      totalColleges: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/colleges/:id
// @desc    Get college by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const college = await College.findById(req.params.id)
      .populate('subgroups', 'name description members')
      .populate('projects', 'title description status ownerId createdAt')
      .populate({
        path: 'projects',
        populate: { path: 'ownerId', select: 'name' }
      });

    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Get stats
    const stats = {
      totalSubgroups: college.subgroups.length,
      totalProjects: college.projects.length,
      activeProjects: college.projects.filter(p => p.status === 'open' || p.status === 'in-progress').length
    };

    res.json({
      ...college.toObject(),
      stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/colleges
// @desc    Create new college
// @access  Private (Admin only)
router.post('/', [
  auth,
  adminAuth,
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('domain').isLength({ min: 3 }).withMessage('Domain must be at least 3 characters').toLowerCase(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, domain } = req.body;

    // Check if college with same name or domain exists
    const existingCollege = await College.findOne({
      $or: [{ name }, { domain }]
    });

    if (existingCollege) {
      return res.status(400).json({ 
        message: 'College with this name or domain already exists' 
      });
    }

    const college = new College({
      name,
      description,
      domain
    });

    await college.save();

    res.status(201).json({
      message: 'College created successfully',
      college
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/colleges/:id
// @desc    Update college
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  adminAuth,
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('domain').optional().isLength({ min: 3 }).withMessage('Domain must be at least 3 characters').toLowerCase(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    const { name, description, domain } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (domain) updateData.domain = domain;

    // Check for conflicts if name or domain is being updated
    if (name || domain) {
      const conflictFilter = { _id: { $ne: req.params.id } };
      if (name) conflictFilter.name = name;
      if (domain) conflictFilter.domain = domain;

      const existingCollege = await College.findOne({
        $and: [
          conflictFilter,
          { $or: [{ name }, { domain }] }
        ]
      });

      if (existingCollege) {
        return res.status(400).json({ 
          message: 'College with this name or domain already exists' 
        });
      }
    }

    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      message: 'College updated successfully',
      college: updatedCollege
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/colleges/:id
// @desc    Delete college
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    await College.findByIdAndDelete(req.params.id);

    res.json({ message: 'College deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
