import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Form State
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });

  const fetchTaskList = async () => {
    setLoading(true);
    setApiError("");
    try {
      const response = await getTasks(statusFilter, sortBy);
      setTasks(response.tasks || []);
    } catch (err) {
      setApiError(err.message || "Failed to fetch tasks from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, [statusFilter, sortBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "title" && value.trim()) {
      setValidationError("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchTaskList();
    } catch (err) {
      setApiError(err.message || "Failed to update status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMsg("");
    setValidationError("");

    if (!formData.title.trim()) {
      setValidationError("Task title cannot be empty.");
      return;
    }

    try {
      if (editingTaskId) {
        await updateTask(editingTaskId, formData);
        setSuccessMsg("Task updated successfully!");
      } else {
        await createTask(formData);
        setSuccessMsg("Task created successfully!");
      }

      resetForm();
      fetchTaskList();
    } catch (err) {
      setApiError(err.message || "Server Error: Could not save task.");
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setApiError("");
    setSuccessMsg("");
  };

  const handleDelete = async (id) => {
    setApiError("");
    setSuccessMsg("");
    try {
      await deleteTask(id);
      setSuccessMsg("Task deleted successfully.");
      fetchTaskList();
    } catch (err) {
      setApiError(err.message || "Could not delete task.");
    }
  };

  const resetForm = () => {
    setEditingTaskId(null);
    setValidationError("");
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen text-gray-800">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Personal Task Manager
        </h1>
        <p className="text-sm text-gray-600">
          Organize, filter, and track your daily work seamlessly.
        </p>
      </header>

      {/* Global API Banner Error */}
      {apiError && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-300 text-red-800 text-sm flex justify-between items-center">
          <span>{apiError}</span>
          <button
            onClick={() => setApiError("")}
            className="font-bold text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successMsg && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-300 text-green-800 text-sm flex justify-between items-center">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg("")}
            className="font-bold text-xs hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Task Creation & Update Form */}
      <div className="p-5 rounded-xl border border-gray-200 bg-white shadow-sm mb-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {editingTaskId ? "Edit Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-white ${
                validationError ? "border-red-500" : "border-gray-300"
              }`}
            />
            {validationError && (
              <p className="text-red-500 text-xs mt-1">{validationError}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Optional notes or details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white resize-none"
            />
          </div>

          {/* Form Controls Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition">
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-100 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-gray-200 bg-white mb-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-gray-600">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white">
            <option value="">All Tasks</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase text-gray-600">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm bg-white">
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Task List Rendering */}
      {loading ? (
        <div className="text-center py-12 text-sm text-gray-500">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 rounded-xl border border-dashed border-gray-300 text-sm text-gray-500 bg-white">
          No tasks found. Create one above to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-gray-900 text-base">
                    {task.title}
                  </h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded border border-gray-200 bg-gray-100 capitalize">
                    {task.priority} Priority
                  </span>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {task.description}
                  </p>
                )}

                {task.dueDate && (
                  <p className="text-xs text-gray-400">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {/* Card Action Items */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleQuickStatusChange(task._id, e.target.value)
                  }
                  className="px-2 py-1 border border-gray-300 rounded text-xs bg-white">
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>

                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1 text-xs font-medium border border-gray-300 rounded hover:bg-gray-100 transition">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1 text-xs font-medium bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
