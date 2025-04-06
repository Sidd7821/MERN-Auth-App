import express from "express";
import {
    login,
    logout,
    signup,
    verifyEmail,
    forgotPassword,
    resetPassword,
    checkAuth,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
    createSession,
    getSessionById,
    listSession,
    updateSession,
} from "../controllers/session.controller.js";

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);

router.post("/", createSession);
router.put("/:id", updateSession);
router.post("/list", listSession);

router.get("/:id", getSessionById);
router.get("/getSession", listSession);

// router.post("/reset-password/:token", resetPassword);

export default router;
