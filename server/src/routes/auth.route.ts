import express from "express";
import { login, logout, signup } from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middleware";

const authRoutes = express.Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/logout", authMiddleware, logout);

export default authRoutes;
