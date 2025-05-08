import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { sendMessage, getMessages, deleteConversation, getConversations, createConversation } from "../controller/message.controller.js";

const router = express.Router();

router.route('/send/:id').post(isAuthenticated, sendMessage);
router.route('/all/:id').get(isAuthenticated, getMessages);
router.route('/delete/:id').delete(isAuthenticated, deleteConversation);
router.route('/conversations').get(isAuthenticated, getConversations);
router.route('/conversation/create/:id').post(isAuthenticated, createConversation);


export default router;
