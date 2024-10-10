const errorHandler = (err, req, res, next) => {
    // Log the error for debugging (optional)
    console.error(err.stack);

    // Set default status code
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Customize the response for specific error types if needed
    if (err.name === 'ValidationError') {
        statusCode = 400; // Bad Request
        message = Object.values(err.errors).map(val => val.message).join(', ');
    }

    // Send the error response
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: message,
    });
};

module.exports = errorHandler;
