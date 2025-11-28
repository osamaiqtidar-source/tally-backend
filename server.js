import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Store tasks for each agent
let pendingTasks = [];

// Default test route
app.get("/", (req, res) => {
    res.send("Backend Working");
});

// Agent asks backend if there are pending tasks
app.get("/agent/tasks/:agentId", (req, res) => {
    const agentId = req.params.agentId;

    const tasks = pendingTasks.filter(t => t.agentId === agentId);

    res.json(tasks);
});

// Agent sends task completion
app.post("/agent/task-done", (req, res) => {
    const { agentId, taskId, success, result } = req.body;

    pendingTasks = pendingTasks.filter(t => t.taskId !== taskId);

    console.log("Task done:", {
        agent: agentId,
        task: taskId,
        success
    });

    res.json({ status: "ok" });
});

// App (mobile/web) sends new task to agent
app.post("/create-task", (req, res) => {
    const { agentId, type, data } = req.body;

    const taskId = "TASK-" + Math.random().toString(36).substring(2, 12);

    pendingTasks.push({
        taskId,
        agentId,
        type,    // read | write
        data
    });

    res.json({ status: "queued", taskId });
});

// Health check route
app.get("/agent/ping", (req, res) => {
    res.send("Service OK");
});

app.listen(PORT, () => {
    console.log("Backend running on port", PORT);
});
