function errorHandler(err, req, res, next) {
    console.error("❌ Error:", err.message);

    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    // Handle Specific Errors
    if (err.name === "ValidationError") {
        statusCode = 400; // Bad Request
        message = "Invalid data input.";
    } 
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401; // Unauthorized
        message = "Invalid token. Please log in again.";
    } 
    else if (err.name === "TokenExpiredError") {
        statusCode = 403; // Forbidden
        message = "Session expired. Please log in again.";
    } 
    else if (err.name === "MongoServerError" && err.code === 11000) {
        statusCode = 400; // Duplicate Key Error 
        message = "Duplicate field value. This resource already exists.";
    }

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }) // Hide stack trace in production
    });

    next();
}

module.exports = errorHandler;