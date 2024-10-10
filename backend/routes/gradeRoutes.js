const express = require('express');
const {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
} = require('../controllers/gradeController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Routes for grades

// @route   POST /api/grades
// @desc    Create a new grade
// @access  Teacher, Admin
router.post('/', protect, authorizeRoles('Teacher', 'Admin'), createGrade);

// @route   GET /api/grades
// @desc    Get all grades
// @access  Admin, Teacher
router.get('/', protect, authorizeRoles('Admin', 'Teacher'), getAllGrades);

// @route   GET /api/grades/:id
// @desc    Get a single grade by ID
// @access  Admin, Teacher, Student
router.get('/:id', protect, authorizeRoles('Admin', 'Teacher', 'Student'), getGradeById);

// @route   PUT /api/grades/:id
// @desc    Update a grade
// @access  Teacher, Admin
router.put('/:id', protect, authorizeRoles('Teacher', 'Admin'), updateGrade);

// @route   DELETE /api/grades/:id
// @desc    Delete a grade
// @access  Admin
router.delete('/:id', protect, authorizeRoles('Admin'), deleteGrade);

module.exports = router;
