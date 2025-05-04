import express from "express";
import { refreshToken } from "../controller/auth.controller.js";
import { login, register, logout } from "../controller/user.controller.js";

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh-token', refreshToken);
router.get('/logout', logout);

export default router;
