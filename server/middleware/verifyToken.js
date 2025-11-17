import { requireAuth } from "@clerk/express";

export const verifyToken = requireAuth();
