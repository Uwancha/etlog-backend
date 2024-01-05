import { Router } from "express";

// Controllers / route handlers
import {
    getUserProfile,
    getUserPosts,
    updateUserPost,
    updateUserProfile
} from "../controllers/profileController.js"

const router = Router();

// Get a user profile
router.get('/profile/:userId', getUserProfile);

// Get a user posts
router.get('/profile/:userId/posts', getUserPosts);

// Update a user post
router.put('/profile/:userId/posts/:postId', updateUserPost);

// Update a user profile
router.put('/profile/:userId', updateUserProfile);

const profileRoutes = router;

export default profileRoutes;
