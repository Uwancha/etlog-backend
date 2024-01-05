import { Router } from "express";

// Controllers / route handlers
import { 
    getCommentsForPost, 
    createComment, 
    updateComment, 
    deleteComment
} from "../controllers/commentcontroller.js"

const router = Router();

// Get comments associated with a post
router.get("/posts/:postId/comments", getCommentsForPost);

// Create comment in a post
router.post("/posts/:postId/comments", createComment);

// Update a comment
router.put('/comments/:commentId', updateComment);

// Delete a comment
router.delete('/comments/:commentId', deleteComment);

const commentRoutes = router;

export default commentRoutes;