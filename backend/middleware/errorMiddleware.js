const errorMiddleware = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((item) => item.message);

    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errorMiddleware;
