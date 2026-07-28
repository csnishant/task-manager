import Task from "../models/Task.js";

const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      priority,
      status,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

//get all task
const getTasks = async (req, res, next) => {
  try {
    const { status, sortBy } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const sort = {};

    if (sortBy === "dueDate") {
      sort.dueDate = 1;
    }

    if (sortBy === "priority") {
      sort.priority = 1;
    }

    const tasks = await Task.find(filter).sort(sort);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

export { createTask, getTasks };
