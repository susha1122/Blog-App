import express from 'express';
import { clerkWebHook } from '../controllers/webhook.controller.js';
import bodyParser from 'body-parser';

const router = express.Router();

// FIX → Allow all content types so Clerk payload is captured
router.post(
  "/clerk",
  bodyParser.raw({ type: "*/*" }),   // FIXED
  clerkWebHook
);


export default router;
