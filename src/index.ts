import express from "express";
import subjectsRouter from "./routes/subjects.js";
import cors from "cors";

const app = express();
const PORT = 8000;

// HANDLE CORS

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Backend server is running." });
});

app.use("/api/subjects", subjectsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
