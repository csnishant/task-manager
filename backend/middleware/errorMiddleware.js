// quick helpers to parse specific mongoose errors cleanly

// handle missing required fields or bad enum values
const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((item) => item.message);
  return {
    statusCode: 400,
    message: messages.join(", "),
  };
};

// handle invalid mongodb objectids (like bad params in url)
const handleCastError = (err) => {
  return {
    statusCode: 400,
    message: `invalid id format for parameter: ${err.path}`,
  };
};

// handle duplicate key entries if unique field fails
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue || {})[0] || "field";
  return {
    statusCode: 400,
    message: `a task with this ${field} already exists`,
  };
};

// global express error handling middleware
const errorMiddleware = (err, req, res, next) => {
  // log error trace in console for debugging
  console.error(`[error]: ${err.stack || err.message}`);

  let statusCode = err.statusCode || res.statusCode;
  if (statusCode === 200) statusCode = 500;

  let message = err.message || "something went wrong on the server";

  // check error type and pick correct status code + message
  if (err.name === "ValidationError") {
    const handled = handleValidationError(err);
    statusCode = handled.statusCode;
    message = handled.message;
  } else if (err.name === "CastError") {
    const handled = handleCastError(err);
    statusCode = handled.statusCode;
    message = handled.message;
  } else if (err.code === 11000) {
    const handled = handleDuplicateKeyError(err);
    statusCode = handled.statusCode;
    message = handled.message;
  }

  // send back clean json response to frontend
  return res.status(statusCode).json({
    success: false,
    message,
    // show stack trace only during local dev
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;
