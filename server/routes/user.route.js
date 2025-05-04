import express from 'express'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import multer from '../middlewares/multer.js';
import { editProfile } from '../controller/user.controller.js';
import { searchUsers, getProfile, followOrUnfollow } from '../controller/user.controller.js'

const router = express.Router()

// Define specific routes first to avoid conflicts with dynamic :id route
router.get('/search', searchUsers)
router.put('/profile', isAuthenticated, multer.single('profilePicture'), editProfile);
router.put('/follow/:id', followOrUnfollow)
router.get('/me', isAuthenticated, getProfile)
router.get('/:id', getProfile)


// Add other user routes as needed

export { router }
