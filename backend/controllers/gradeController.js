const Grade = require('../models/Grade');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new grade
// @route   POST /api/grades
// @access  Teacher, Admin
exports.createGrade = async (req, res) => {
  const { studentId, courseId, grade, feedback } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const newGrade = new Grade({
      student: studentId,
      course: courseId,
      grade,
      feedback,
      gradedBy: req.user.id, // Teacher or Admin
    });

    await newGrade.save();
    res.status(201).json({ success: true, data: newGrade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all grades
// @route   GET /api/grades
// @access  Admin, Teacher
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('gradedBy', 'name email');

    res.status(200).json({ success: true, count: grades.length, data: grades });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single grade by ID
// @route   GET /api/grades/:id
// @access  Admin, Teacher, Student
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'name email')
      .populate('course', 'title')
      .populate('gradedBy', 'name email');

    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }

    res.status(200).json({ success: true, data: grade });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a grade
// @route   PUT /api/grades/:id
// @access  Teacher, Admin
exports.updateGrade = async (req, res) => {
  try {
    const { grade, feedback } = req.body;
    const gradeRecord = await Grade.findById(req.params.id);

    if (!gradeRecord) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }

    gradeRecord.grade = grade || gradeRecord.grade;
    gradeRecord.feedback = feedback || gradeRecord.feedback;

    await gradeRecord.save();
    res.status(200).json({ success: true, data: gradeRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a grade
// @route   DELETE /api/grades/:id
// @access  Admin
exports.deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);

    if (!grade) {
      return res.status(404).json({ success: false, message: 'Grade not found' });
    }

    await grade.remove();
    res.status(200).json({ success: true, message: 'Grade removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

