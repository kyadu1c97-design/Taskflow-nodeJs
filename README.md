# TaskFlow — Node.js Task Management App

TaskFlow is a responsive task management web application built with **Node.js, Express.js, HTML, CSS and vanilla JavaScript**. It helps users create, organize, track and search tasks through a clean dashboard.

## Features
- Create tasks with title, description, priority and due date
- Update task status: Pending, In Progress or Completed
- Delete tasks
- Search tasks and filter by status
- Dashboard statistics for total, pending, in-progress and completed tasks
- Persistent local JSON storage
- REST API with basic input validation
- Responsive layout for mobile and desktop

## Tech stack
- Backend: Node.js, Express.js
- Frontend: HTML5, CSS3, JavaScript (Fetch API)
- Storage: JSON file using Node.js file system

## Run locally
1. Install Node.js (18 or newer).
2. Extract this project and open its folder in VS Code.
3. Run `npm install`.
4. Run `npm start`.
5. Open `http://localhost:3000` in your browser.

For development with automatic restart, run `npm run dev`.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/tasks` | List tasks; supports `status` and `search` query parameters |
| GET | `/api/stats` | Task summary statistics |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update task status or title |
| DELETE | `/api/tasks/:id` | Delete a task |

### Example: create a task
```json
{
  "title": "Complete Node.js assignment",
  "description": "Build and test the REST API",
  "priority": "High",
  "dueDate": "2026-12-01"
}
```

## Project structure
```text
taskflow-nodejs/
├── data/
│   └── tasks.json
├── public/
│   ├── app.js
│   ├── index.html
│   └── style.css
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Note
Task data is stored locally in `data/tasks.json`. For production deployment with multiple users, replace this simple storage layer with a database such as MongoDB or PostgreSQL and add authentication.
