const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "tasks.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");

function readTasks() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
function writeTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2), "utf8");
}
function validTask(body) {
  return typeof body.title === "string" && body.title.trim().length > 0 &&
    body.title.trim().length <= 100 &&
    ["Low", "Medium", "High"].includes(body.priority || "Medium");
}

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "TaskFlow API" }));

app.get("/api/tasks", (req, res) => {
  let tasks = readTasks();
  const { status, search } = req.query;
  if (status && status !== "All") tasks = tasks.filter(t => t.status === status);
  if (search) {
    const q = String(search).toLowerCase();
    tasks = tasks.filter(t => t.title.toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q));
  }
  tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(tasks);
});

app.get("/api/stats", (_req, res) => {
  const tasks = readTasks();
  res.json({
    total: tasks.length,
    completed: tasks.filter(t => t.status === "Completed").length,
    pending: tasks.filter(t => t.status === "Pending").length,
    inProgress: tasks.filter(t => t.status === "In Progress").length
  });
});

app.post("/api/tasks", (req, res) => {
  if (!validTask(req.body)) return res.status(400).json({ error: "Enter a title (max 100 characters) and a valid priority." });
  const tasks = readTasks();
  const task = {
    id: crypto.randomUUID(),
    title: req.body.title.trim(),
    description: String(req.body.description || "").trim().slice(0, 500),
    priority: req.body.priority || "Medium",
    status: "Pending",
    dueDate: req.body.dueDate || "",
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  writeTasks(tasks);
  res.status(201).json(task);
});

app.patch("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found." });
  if (req.body.status && !["Pending", "In Progress", "Completed"].includes(req.body.status))
    return res.status(400).json({ error: "Invalid status." });
  if (req.body.status) task.status = req.body.status;
  if (req.body.title !== undefined) {
    if (typeof req.body.title !== "string" || !req.body.title.trim())
      return res.status(400).json({ error: "Title cannot be empty." });
    task.title = req.body.title.trim().slice(0, 100);
  }
  writeTasks(tasks);
  res.json(task);
});

app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const updated = tasks.filter(t => t.id !== req.params.id);
  if (updated.length === tasks.length) return res.status(404).json({ error: "Task not found." });
  writeTasks(updated);
  res.json({ message: "Task deleted successfully." });
});

app.listen(PORT, () => console.log(`TaskFlow is running at http://localhost:${PORT}`));
