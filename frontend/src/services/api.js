import { TASK_API_END_POINT } from "../utils/constant";


// Get all tasks
export const getTasks = async (status = "", sortBy = "") => {
  const params = new URLSearchParams();

  if (status) {
    params.append("status", status);
  }

  if (sortBy) {
    params.append("sortBy", sortBy);
  }

  const queryString = params.toString();
  const url = queryString
    ? `${TASK_API_END_POINT}?${queryString}`
    : TASK_API_END_POINT;

  const response = await fetch(url);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch tasks");
  }

  return data;
};

// Get a single task
export const getTaskById = async (taskId) => {
  const response = await fetch(`${TASK_API_END_POINT}/${taskId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch task");
  }

  return data;
};

// Create a new task
export const createTask = async (taskData) => {
  const response = await fetch(TASK_API_END_POINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create task");
  }

  return data;
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  const response = await fetch(`${TASK_API_END_POINT}/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update task");
  }

  return data;
};

// Delete a task
export const deleteTask = async (taskId) => {
  const response = await fetch(`${TASK_API_END_POINT}/${taskId}`, {
    method: "DELETE",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete task");
  }

  return data;
};
