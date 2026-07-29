import React, { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "../services/api"; // Adjust this path according to your project structure

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uiError, setUiError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Filters & Sorting State
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

  // Fetch all tasks matching active filters
  const fetchTaskList = async () => {
    setLoading(true);
    setUiError("");
    try {
      const response = await getTasks(statusFilter, sortBy);
      setTasks(response.tasks || []);
    } catch (err) {
      setUiError(err.message || "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, [statusFilter, sortBy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Handler for both Create and Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUiError("");
    setSuccessMsg("");

    if (!formData.title.trim()) {
      setUiError("Task title is required.");
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
      setUiError(err.message || "An error occurred while saving the task.");
    }
  };

  // Populate form for editing
  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    });
    setUiError("");
    setSuccessMsg("");
  };

  // Delete Handler
  const handleDelete = async (id) => {
    setUiError("");
    setSuccessMsg("");
    try {
      await deleteTask(id);
      setSuccessMsg("Task deleted successfully.");
      fetchTaskList();
    } catch (err) {
      setUiError(err.message || "Failed to delete task.");
    }
  };

  // Reset Form
  const resetForm = () => {
    setEditingTaskId(null);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      dueDate: "",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 min-h-screen text-gray-800">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-red-900">
          Task Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage, filter, and organize your workload effortlessly.
        </p>
      </header>

      {/* Global Status Notifications */}
      {uiError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex justify-between items-center">
          <span>{uiError}</span>
          <button
            onClick={() => setUiError("")}
            className="text-red-500 hover:text-red-700 font-semibold text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex justify-between items-center">
          <span>{successMsg}</span>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-emerald-500 hover:text-emerald-700 font-semibold text-xs ml-4">
            Dismiss
          </button>
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <h2 className="text-lg font-medium text-slate-800 mb-4">
          {editingTaskId ? "Edit Task" : "Create New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Design wireframes for onboarding flow"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add relevant notes or sub-tasks..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition">
              {editingTaskId ? "Update Task" : "Save Task"}
            </button>

            {editingTaskId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm hover:bg-slate-200 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Sort By:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">None</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          Loading tasks...
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300 text-slate-400 text-sm">
          No tasks found. Create one above to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800 text-base">
                    {task.title}
                  </h3>

                  {/* Priority Tag */}
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md capitalize ${
                      task.priority === "high"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : task.priority === "medium"
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                    {task.priority}
                  </span>

                  {/* Status Tag */}
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                      task.status === "done"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : task.status === "in_progress"
                          ? "bg-blue-50 text-blue-600 border border-blue-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                    {task.status === "in_progress"
                      ? "In Progress"
                      : task.status === "todo"
                        ? "To Do"
                        : "Done"}
                  </span>
                </div>

                {task.description && (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {task.description}
                  </p>
                )}

                {task.dueDate && (
                  <p className="text-xs text-slate-400 pt-1">
                    Due on: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleEdit(task)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition">
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
