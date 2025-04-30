import express from "express";
import { refreshToken } from "../controller/auth.controller.js";

const router = express.Router();

router.post('/refresh-token', refreshToken);

export default router;
