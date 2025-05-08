import express from 'express';
import { getNotifications } from '../controller/notification.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';

const router = express.Router();

router.get('/notifications', isAuthenticated, getNotifications);

export default router;
