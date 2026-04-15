import AgentAPI from "apminsight";

AgentAPI.config();

import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";

import securityMiddleware from "./middleware/security.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./db/lib/auth.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);

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

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
