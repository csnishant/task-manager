import express from "express";
import cors from "cors";
import helmet from "helmet";

import taskRoutes from "./routes/taskRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";


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

//taskRoutes
app.use("/tasks", taskRoutes);


app.use(errorMiddleware)

export default app;
