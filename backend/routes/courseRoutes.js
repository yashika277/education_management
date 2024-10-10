const express = require('express');
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Routes for courses

// @route   POST /api/courses
// @desc    Create a new course
// @access  Admin
router.post('/', protect, authorizeRoles('Admin'), createCourse);

// @route   GET /api/courses
// @desc    Get all courses
// @access  Admin, Teacher, Student
router.get('/', protect, authorizeRoles('Admin', 'Teacher', 'Student'), getAllCourses);

// @route   GET /api/courses/:id
// @desc    Get a single course by ID
// @access  Admin, Teacher, Student
router.get('/:id', protect, authorizeRoles('Admin', 'Teacher', 'Student'), getCourseById);

// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Admin
router.put('/:id', protect, authorizeRoles('Admin'), updateCourse);

// @route   DELETE /api/courses/:id
// @desc    Delete a course
// @access  Admin
router.delete('/:id', protect, authorizeRoles('Admin'), deleteCourse);

module.exports = router;
