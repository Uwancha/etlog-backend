import { Router } from "express";

// Controllers / route handlers
import {
    getUserProfile,
    getUserPosts,
    updateUserProfile
} from "../controllers/profileController.js";

// Protect routes
import { isAuthorized } from "../utils/isAuthorized.js";

const router = Router();

// Get a user profile
router.get('/profile/:userId', isAuthorized, getUserProfile);

// Get a user posts
router.get('/profile/:userId/posts', isAuthorized, getUserPosts);

// Update a user profile
router.put('/profile/:userId', isAuthorized, updateUserProfile);

const profileRoutes = router;

export default profileRoutes;
