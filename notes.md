# Project Notes

## 1. Supporting Multiple Users

If this application needs to support multiple users, I would add a `userId` field to the Task model and associate each task with the user who created it. I would also add authentication, such as JWT-based login, and protect the task APIs so users can only access and modify their own tasks.

## 2. Handling Thousands of Tasks

The first performance concern I would address is loading all tasks in a single API request. I would add pagination to the `GET /tasks` endpoint using parameters such as `page` and `limit`, and add database indexes on frequently filtered or sorted fields such as `status`, `dueDate`, and `userId`.

## 3. Use of AI Coding Tools

I did not use AI tools to build the core functionality of this assignment. I primarily used Google and official documentation to understand and solve implementation issues, and only used limited AI assistance for debugging when I encountered errors.
