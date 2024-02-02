import { Router } from "express";
import passport from "passport";

// Controllers / route handlers
import {
    getUserProfile,
    getUserPosts,
    updateUserProfile
} from "../controllers/profileController.js";

const router = Router();

// Get a user profile
router.get('/profile/:userId', passport.authenticate('jwt', {session: false}), getUserProfile);


// Update a user profile
router.put('/profile/:userId', passport.authenticate('jwt', {session: false}), updateUserProfile);

const profileRoutes = router;

export default profileRoutes;
