const express = require('express');
const {
  createEnrollment,
  getAllEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Routes for enrollments

// @route   POST /api/enrollments
// @desc    Create a new enrollment
// @access  Admin, Student
router.post('/', protect, authorizeRoles('Admin', 'Student'), createEnrollment);

// @route   GET /api/enrollments
// @desc    Get all enrollments
// @access  Admin, Teacher
router.get('/', protect, authorizeRoles('Admin', 'Teacher'), getAllEnrollments);

// @route   GET /api/enrollments/:id
// @desc    Get a single enrollment by ID
// @access  Admin, Teacher, Student
router.get('/:id', protect, authorizeRoles('Admin', 'Teacher', 'Student'), getEnrollmentById);

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment status (Admin only)
// @access  Admin
router.put('/:id', protect, authorizeRoles('Admin'), updateEnrollment);

// @route   DELETE /api/enrollments/:id
// @desc    Delete an enrollment (Admin only)
// @access  Admin
router.delete('/:id', protect, authorizeRoles('Admin'), deleteEnrollment);

module.exports = router;
