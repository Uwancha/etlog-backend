import { Router } from "express";

// Controllers / route handlers
import { signup, login } from "../controllers/authController.js"

const router = Router();

// Create/register a user
router.post('/signup', signup);

// Login a user
router.post('/login', login);

const authRoutes = router;

export default authRoutes;