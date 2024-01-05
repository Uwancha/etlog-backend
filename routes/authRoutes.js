import { Router } from "express";

// Controllers / route handlers
import { signup, login } from "../controllers/authController.js"

const router = Router();

router.post('/signup', signup);
router.post('/login', login);

const authRoutes = router;

export default authRoutes;