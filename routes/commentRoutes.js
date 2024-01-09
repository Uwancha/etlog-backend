import { Router } from "express";

// Controllers / route handlers
import {  
    createComment, 
    updateComment, 
    deleteComment
} from "../controllers/commentController.js"
import { isAuthorized } from "../utils/isAuthorized.js";

const router = Router();

// Create comment in a post
router.post("/posts/:postId/comments", isAuthorized, createComment);

// Update a comment
router.put('/comments/:commentId', isAuthorized, updateComment);

// Delete a comment
router.delete('/comments/:commentId', isAuthorized, deleteComment);

const commentRoutes = router;

export default commentRoutes;