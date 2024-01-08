import { Router } from "express";

// Controllers / route handlers
import { 
    getAllPosts, 
    getPostById, 
    createPost, 
    updatePost, 
    deletePost 
} from "../controllers/postController.js";
import { isAuthorized } from "../utils/isAuthorized.js";

const router = Router();

// Get all posts
router.get("/posts", getAllPosts);

// Get a single post
router.get("/posts/:postId", isAuthorized, getPostById);

// Create a post
router.post("/posts", isAuthorized, createPost);

// Update/Edit a single post
router.put("/posts/:postId", isAuthorized, updatePost);

// Delete a single post
router.delete("/posts/:postId", isAuthorized, deletePost);

const postRoutes = router;

export default postRoutes;