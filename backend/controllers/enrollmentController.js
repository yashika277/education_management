const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new enrollment
// @route   POST /api/enrollments
// @access  Admin, Student
exports.createEnrollment = async (req, res) => {
  const { studentId, courseId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollment = new Enrollment({
      student: studentId,
      course: courseId,
    });

    await enrollment.save();
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Admin, Teacher
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email')
      .populate('course', 'title description');

    res.status(200).json({ success: true, count: enrollments.length, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Admin, Teacher, Student
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title description');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update enrollment status (Admin only)
// @route   PUT /api/enrollments/:id
// @access  Admin
exports.updateEnrollment = async (req, res) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    enrollment.status = status || enrollment.status;

    await enrollment.save();
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete enrollment (Admin only)
// @route   DELETE /api/enrollments/:id
// @access  Admin
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    await enrollment.remove();
    res.status(200).json({ success: true, message: 'Enrollment removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
