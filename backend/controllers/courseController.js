const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin
// exports.createCourse = async (req, res) => {
//     const { title, description, teacherEmail } = req.body;
  
//     try {
//       // Find the teacher by email
//       const teacher = await User.findOne({ email: teacherEmail });
  
//       if (!teacher) {
//         return res.status(404).json({ success: false, message: 'Teacher not found' });
//       }
  
//       const course = new Course({
//         title,
//         description,
//         teacher: teacher._id, // Use teacher's ObjectId
//       });
  
//       await course.save();
//       res.status(201).json({ success: true, data: course });
//     } catch (error) {
//       res.status(500).json({ success: false, message: error.message });
//     }
//   };

// exports.createCourse = async (req, res) => {
//   const { title, description, teacher, students } = req.body; // Accept students from the request

//   try {
//     const course = new Course({
//       title,
//       description,
//       teacher, // This should be the ObjectId of the teacher
//       students, // Add the students' ObjectIds
//     });

//     await course.save();
//     res.status(201).json({ success: true, data: course });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
exports.createCourse = async (req, res) => {
    const { title, description, teacher, students } = req.body; // Accept teacher and students from the request

    try {
        // Find the teacher by email
        const teacherUser = await User.findOne({ email: teacher });
        if (!teacherUser) {
            return res.status(404).json({ success: false, message: "Teacher not found" });
        }

        // Find the students by their emails
        const studentUsers = await User.find({ email: { $in: students } });
        const studentIds = studentUsers.map(user => user._id); // Get the ObjectId of each student

        // Create the course
        const course = new Course({
            title,
            description,
            teacher: teacherUser._id, // Use the teacher's ObjectId
            students: studentIds, // Add the students' ObjectIds
        });

        await course.save();
        res.status(201).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Admin, Teacher, Student
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('teacher', 'name email').populate('students', 'name email');
        res.status(200).json({ success: true, count: courses.length, data: courses });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Admin, Teacher, Student
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('teacher', 'name email').populate('students', 'name email');

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Admin
exports.updateCourse = async (req, res) => {
    try {
        const { title, description, teacher, students } = req.body; // Accept teacher and students from the request
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Update course fields if provided
        course.title = title || course.title;
        course.description = description || course.description;

        if (teacher) {
            const teacherUser = await User.findOne({ email: teacher });
            if (!teacherUser) {
                return res.status(404).json({ success: false, message: "Teacher not found" });
            }
            course.teacher = teacherUser._id; // Update teacher ObjectId
        }

        if (students) {
            const studentUsers = await User.find({ email: { $in: students } });
            const studentIds = studentUsers.map(user => user._id);
            course.students = studentIds; // Update students' ObjectIds
        }

        await course.save();
        res.status(200).json({ success: true, data: course });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Admin
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        await course.remove();
        res.status(200).json({ success: true, message: 'Course removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
