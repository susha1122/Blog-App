// user.route.js (full file)
import express from 'express';
import { getUserSavedPosts, savePost } from '../controllers/user.controller.js';
import { requireAuth } from '@clerk/express';

const router = express.Router();

router.get('/saved', requireAuth(), getUserSavedPosts);
router.patch('/save', requireAuth(), savePost);

export default router;
