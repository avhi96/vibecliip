import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';
import {
    addNewPost,
    getAllPosts,
    getUserPost,
    likePost,
    dislikePost,
    addComment,
    getComments,
    deletePost,
    bookmarkPost
} from '../controller/post.controller.js';

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single("postImage"), addNewPost);
router.route("/all").get(isAuthenticated, getAllPosts);
router.route("/userpost/all").get(isAuthenticated, getUserPost);
router.route('/user/:userId').get(getUserPost);
router.route("/:id/like").get(isAuthenticated, likePost);
router.route("/:id/dislike").get(isAuthenticated, dislikePost);
router.route("/:id/comment").post(isAuthenticated, addComment);
router.route("/:id/comment/all").get(isAuthenticated, getComments);
router.route("/delete/:id").post(isAuthenticated, deletePost);
router.route("/:id/bookmark").post(isAuthenticated, bookmarkPost);

export default router;