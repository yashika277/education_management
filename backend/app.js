const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const errorHandler = require('./utils/errorHandler');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const gradeRoutes = require('./routes/gradeRoutes');

const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

// Dev logging middleware (only during development)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent parameter pollution
app.use(hpp());

app.use(cors());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, 'public')));


app.use('/api/users', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/grades', gradeRoutes);

app.use(errorHandler);


app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
  });
});

app.get('/', (req, res) => {
    res.send(`
        <center>
            <h1>Welcome to the Education_Management_System!</h1>
            <br>
            <p>
                Get EXPENSE_CONTROLLER_TOOL: 
            <a href="https://github.com/RonakPatel2468/EDUCATION_MANAGEMENT_SYSTEM.git" target="_blank">Repository:Education_Management_System </a>
            </p>
        </center>
    `);
});

// Set port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
