const express = require('express');
const { body, validationResult } = require('express-validator');
const Project = require('../models/Project');
const College = require('../models/College');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/projects
// @desc    Get all projects (with pagination and filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, collegeId, tags } = req.query;

    let filter = {};
    if (status) filter.status = status;
    if (collegeId) filter.collegeId = collegeId;
    if (tags) filter.tags = { $in: tags.split(',') };

    const projects = await Project.find(filter)
      .populate('ownerId', 'name email')
      .populate('collegeId', 'name domain')
      .populate('members', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(filter);

    res.json({
      projects,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProjects: total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('ownerId', 'name email role')
      .populate('collegeId', 'name domain description')
      .populate('members', 'name email role');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects
// @desc    Create new project
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, tags } = req.body;

    const project = new Project({
      title,
      description,
      tags: tags || [],
      ownerId: req.user._id,
      collegeId: req.user.collegeId,
      members: [req.user._id]
    });

    await project.save();

    // Add project to college
    await College.findByIdAndUpdate(
      req.user.collegeId,
      { $push: { projects: project._id } }
    );

    const populatedProject = await Project.findById(project._id)
      .populate('ownerId', 'name email')
      .populate('collegeId', 'name domain')
      .populate('members', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project: populatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private (Owner only)
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('description').optional().trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only project owner can update.' });
    }

    const { title, description, tags, status } = req.body;
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (tags) updateData.tags = tags;
    if (status) updateData.status = status;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('ownerId', 'name email')
     .populate('collegeId', 'name domain')
     .populate('members', 'name email');

    res.json({
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/projects/:id/join
// @desc    Join project
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is already a member
    if (project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already a member of this project' });
    }

    // Check if project is from same college
    if (project.collegeId.toString() !== req.user.collegeId.toString()) {
      return res.status(403).json({ message: 'You can only join projects from your college' });
    }

    project.members.push(req.user._id);
    await project.save();

    res.json({ message: 'Successfully joined the project' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id/leave
// @desc    Leave project
// @access  Private
router.delete('/:id/leave', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is a member
    if (!project.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are not a member of this project' });
    }

    // Check if user is owner
    if (project.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Project owner cannot leave. Transfer ownership first.' });
    }

    project.members = project.members.filter(member => member.toString() !== req.user._id.toString());
    await project.save();

    res.json({ message: 'Successfully left the project' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is owner
    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied. Only project owner can delete.' });
    }

    await Project.findByIdAndDelete(req.params.id);

    // Remove project from college
    await College.findByIdAndUpdate(
      project.collegeId,
      { $pull: { projects: project._id } }
    );

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
