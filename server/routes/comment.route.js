import express from "express";
import { addComment, getPostComments, deleteComment } from "../controllers/comment.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// GET comments for a post
router.get("/:postId", getPostComments);

// ADD a comment
router.post("/:postId", verifyToken, addComment);

// DELETE a comment
router.delete("/:id", verifyToken, deleteComment);

export default router;
