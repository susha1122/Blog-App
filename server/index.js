// index.js (full file)
import express from "express";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import connectDB from "./lib/connectDB.js";
import dotenv from "dotenv";
import webHookRouter from "./routes/webhook.route.js";
import { clerkMiddleware } from "@clerk/express";
import cors from "cors";

dotenv.config();

const app = express();

// CORS - allow the client origin (set in .env)
app.use(cors({ origin: process.env.CLIENT_URL }));

// Webhook route must receive raw body for signature verification.
// It's registered BEFORE express.json() and clerkMiddleware() so bodyParser.raw works correctly.
app.use("/webhooks", webHookRouter);

// Body parser for regular JSON endpoints
app.use(express.json());

// Clerk middleware for protecting routes and providing req.auth()
app.use(clerkMiddleware());

// Optional: safety headers (CORS already handles most)
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// Routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);

// Global error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

app.listen(3000, () => {
  connectDB();
  console.log("server is running on port 3000!");
});
