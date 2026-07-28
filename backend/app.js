import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// security middleware
app.use(helmet());

// allow request from client
app.use(cors());

// parse  JSON request body
app.use(express.json());

// health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Personal Task Manager API is running",
  });
});

export default app;
