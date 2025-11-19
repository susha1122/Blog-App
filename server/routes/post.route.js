// post.route.js (full file)
import express from "express";
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost } from "../controllers/post.controller.js";
import { requireAuth } from "@clerk/express";
import increaseVisit from "../middleware/increaseVisit.js";

const router = express.Router();

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", requireAuth(), createPost);
router.delete("/:id", requireAuth(), deletePost);
router.patch("/feature", featurePost);

export default router;
