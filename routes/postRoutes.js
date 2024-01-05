import { Router } from "express";

// Controllers / route handlers
import { 
    getAllPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost 
} from "../controllers/postController";

const router = Router();

// Get all posts
router.get("/posts", getAllPosts);

// Get a single post
router.get("/posts/:postId", getPostById);

// Create a post
router.post("/posts", createPost);

// Update/Edit a single post
router.put("/posts/:postId", );updatePost

// Delete a single post
router.delete("/posts/:postId", deletePost);

const postRoutes = router;

export default postRoutes;