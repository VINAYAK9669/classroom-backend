import "dotenv/config";
import AgentAPI from "apminsight";

AgentAPI.config();

import express from "express";

import cors from "cors";

import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./db/lib/auth.js";

// Routes Import
import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";

const app = express();
const PORT = Number(process.env.PORT || 8080);

// HANDLE CORS

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.all("/api/auth/{*splat}", toNodeHandler(auth));

app.use(express.json());

app.use(securityMiddleware);

app.get("/", (_req, res) => {
  res.json({ message: "Backend server is running." });
});

app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
