# Personal Task Manager

A full-stack Personal Task Manager application built with the MERN stack (MongoDB, Express.js, React.js, and Node.js).

The application allows users to create, organize, update, filter, sort, and delete personal tasks through a simple React-based interface backed by a RESTful API.

---

## Features

### Task Management

* Create a new task
* View all tasks
* View a single task by ID
* Update task details
* Update task status
* Delete tasks
* Filter tasks by status
* Sort tasks by due date
* Sort tasks by priority

### Task Properties

Each task contains:

* Title
* Description
* Priority
* Status
* Due Date
* Created At
* Updated At

### Validation and Error Handling

* Required task title validation
* Priority validation
* Status validation
* Invalid MongoDB ID handling
* Non-existent task handling
* Centralized error-handling middleware
* Clear API error responses
* No raw server stack traces returned to clients

### Frontend

* Single-page React application
* Task creation form
* Task list display
* Status filtering
* Status updates
* Task deletion
* Loading states
* API error handling
* UI updates after server operations

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* CSS
* Fetch API

### Backend

* Node.js
* Express.js
* Mongoose
* MongoDB

### Development Tools

* Git
* GitHub
* Postman
* VS Code

---

## Project Structure

```text
personal-task-manager/
│
├── backend/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   └── taskController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── Task.js
│   │   │
│   │   ├── routes/
│   │   │   └── taskRoutes.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── NOTES.md
└── README.md
```

---

# Data Model

The application uses a MongoDB collection named `tasks`.

Each task follows this structure:

| Field         | Type   | Required      | Description                      |
| ------------- | ------ | ------------- | -------------------------------- |
| `title`       | String | Yes           | Name of the task                 |
| `description` | String | No            | Additional task details          |
| `priority`    | String | No            | `low`, `medium`, or `high`       |
| `status`      | String | No            | `todo`, `in_progress`, or `done` |
| `dueDate`     | Date   | No            | Optional deadline                |
| `createdAt`   | Date   | Automatically | Task creation timestamp          |
| `updatedAt`   | Date   | Automatically | Last update timestamp            |

The `createdAt` and `updatedAt` fields are automatically managed using Mongoose timestamps.

### Priority Values

```text
low
medium
high
```

### Status Values

```text
todo
in_progress
done
```

---

# Backend Setup

## Prerequisites

Make sure the following are installed:

* Node.js
* npm
* MongoDB Atlas account or local MongoDB
* Git

---

## 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

Move into the project directory:

```bash
cd personal-task-manager
```

---

## 2. Backend Installation

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

---

## 3. Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Example `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Do not commit the real `.env` file to GitHub.

---

## 4. Run the Backend

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The backend will run on:

```text
http://localhost:5000
```

You can check the API status by opening:

```text
http://localhost:5000
```

Expected response:

```json
{
  "success": true,
  "message": "Personal Task Manager API is running"
}
```

---

# API Documentation

Base URL:

```text
http://localhost:5000
```

---

## 1. Create a Task

### Request

```http
POST /tasks
```

### Request Body

```json
{
  "title": "Complete MERN Assignment",
  "description": "Build a Personal Task Manager",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-07-30"
}
```

### Success Response

```json
{
  "success": true,
  "message": "Task created successfully",
  "task": {
    "_id": "task_id",
    "title": "Complete MERN Assignment",
    "description": "Build a Personal Task Manager",
    "priority": "high",
    "status": "todo",
    "dueDate": "2026-07-30T00:00:00.000Z",
    "createdAt": "2026-07-28T10:00:00.000Z",
    "updatedAt": "2026-07-28T10:00:00.000Z"
  }
}
```

### Validation Example

If the title is empty:

```json
{
  "title": ""
}
```

The API returns a `400 Bad Request` response with a clear validation message.

---

## 2. Get All Tasks

### Request

```http
GET /tasks
```

Returns all tasks.

### Filter by Status

```http
GET /tasks?status=todo
```

Other supported status values:

```text
todo
in_progress
done
```

### Sort by Due Date

```http
GET /tasks?sortBy=dueDate
```

### Sort by Priority

```http
GET /tasks?sortBy=priority
```

Priority is sorted logically:

```text
high
medium
low
```

### Filter and Sort Together

```http
GET /tasks?status=todo&sortBy=dueDate
```

---

## 3. Get a Single Task

### Request

```http
GET /tasks/:id
```

Example:

```http
GET /tasks/507f1f77bcf86cd799439011
```

If the task does not exist, the API returns:

```text
404 Not Found
```

If the provided ID is invalid, the API returns:

```text
400 Bad Request
```

---

## 4. Update a Task

### Request

```http
PUT /tasks/:id
```

Example:

```http
PUT /tasks/507f1f77bcf86cd799439011
```

### Request Body

Only the fields that need to be changed can be sent.

For example, to update the status:

```json
{
  "status": "done"
}
```

To update priority:

```json
{
  "priority": "high"
}
```

To update multiple fields:

```json
{
  "title": "Updated Task",
  "priority": "medium",
  "status": "in_progress"
}
```

The API validates updated values before saving them.

---

## 5. Delete a Task

### Request

```http
DELETE /tasks/:id
```

Example:

```http
DELETE /tasks/507f1f77bcf86cd799439011
```

### Success Response

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

If the task does not exist:

```text
404 Not Found
```

---

# Error Handling

The backend uses centralized error-handling middleware.

The main error cases handled include:

### Validation Error

```text
400 Bad Request
```

Example:

```json
{
  "success": false,
  "message": "Task title is required"
}
```

### Invalid Task ID

```text
400 Bad Request
```

Example:

```json
{
  "success": false,
  "message": "Invalid task ID"
}
```

### Task Not Found

```text
404 Not Found
```

Example:

```json
{
  "success": false,
  "message": "Task not found"
}
```

### Unexpected Server Error

```text
500 Internal Server Error
```

Example:

```json
{
  "success": false,
  "message": "Internal server error"
}
```

Raw stack traces are not returned to the client.

---

# Frontend Setup

Open a new terminal from the project root.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

If the frontend uses an environment variable for the backend URL, create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The React application will be available at the URL shown by Vite, typically:

```text
http://localhost:5173
```

---

# Frontend Functionality

The React application provides a simple interface for managing tasks.

## Task Creation

Users can create a task using a form containing:

* Title
* Description
* Priority
* Status
* Due Date

The form sends the data to:

```http
POST /tasks
```

After successful creation, the new task is displayed in the UI without requiring a manual page refresh.

---

## Task Filtering

Tasks can be filtered by:

```text
All
Todo
In Progress
Done
```

The selected status is used to retrieve or filter the corresponding tasks.

---

## Task Status Update

Users can update a task's status using a dropdown.

Available statuses:

```text
Todo
In Progress
Done
```

When the status changes, the frontend sends an update request to:

```http
PUT /tasks/:id
```

The UI is updated after the server successfully processes the request.

---

## Task Deletion

Users can delete a task from the task list.

The frontend sends:

```http
DELETE /tasks/:id
```

After a successful response, the deleted task is removed from the UI.

---

## Loading State

The frontend displays a loading state while waiting for API responses.

This prevents the interface from appearing unresponsive during network requests.

---

## Error Handling

API errors are handled on the frontend and displayed to the user with a meaningful message.

For example:

* Failed to load tasks
* Failed to create task
* Failed to update task
* Failed to delete task

The loading state is cleared even when an API request fails so that the UI does not remain stuck.

---

# Application Flow

The overall application flow is:

```text
React Frontend
      │
      │ HTTP Request
      ▼
Express REST API
      │
      ▼
Task Routes
      │
      ▼
Task Controllers
      │
      ▼
Task Model
      │
      ▼
MongoDB
      │
      ▼
API Response
      │
      ▼
React State Update
      │
      ▼
Updated UI
```

---

# Backend Architecture

The backend follows separation of concerns.

### `models`

Defines the MongoDB data structure and validation rules.

```text
models/Task.js
```

### `controllers`

Contains the application logic for creating, reading, updating, and deleting tasks.

```text
controllers/taskController.js
```

### `routes`

Defines the API endpoints and connects them to controllers.

```text
routes/taskRoutes.js
```

### `middleware`

Handles errors centrally so controllers do not need to repeat error-response logic.

```text
middleware/errorMiddleware.js
```

### `config`

Contains database connection configuration.

```text
config/db.js
```

### `app.js`

Configures Express middleware and API routes.

### `server.js`

Connects to MongoDB and starts the HTTP server.

---

# Testing

The REST API can be tested using Postman.

Recommended test cases:

### Create

* Valid task
* Empty title
* Invalid priority
* Invalid status

### Read

* Get all tasks
* Filter by `todo`
* Filter by `in_progress`
* Filter by `done`
* Sort by due date
* Sort by priority
* Get valid task ID
* Get invalid task ID
* Get non-existent task ID

### Update

* Update title
* Update description
* Update priority
* Update status
* Update due date
* Update multiple fields
* Invalid status
* Invalid task ID
* Non-existent task ID

### Delete

* Delete existing task
* Delete non-existent task
* Delete using invalid ID

---

# Running the Complete Project

You need two terminals.

### Terminal 1 — Backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:5000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Environment Variables

The project uses environment variables for configuration.

Backend `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Real secrets and environment files should not be committed to Git.

The repository includes `.env.example` files to show the required configuration.

---

# Future Improvements

If this application were extended beyond the scope of the assessment, possible improvements would include:

* User authentication using JWT
* User-specific private task lists
* Pagination for large task collections
* Search by task title
* Task categories or tags
* Task editing interface
* Drag-and-drop status management
* Automated tests
* API documentation using Swagger
* Rate limiting
* Deployment using a cloud platform
* Database indexes for frequently queried fields

---

# Git History

The project was developed incrementally using multiple Git commits rather than submitting one large squashed commit.

Example development history:

```text
Initial project setup
Add MongoDB connection
Add Task model
Add task creation API
Add task CRUD APIs
Add filtering and sorting
Improve validation and error handling
Add React task interface
Connect frontend with backend
Add loading and error states
Update README and documentation
```

---

# License

This project was created as part of a MERN stack technical assessment.
