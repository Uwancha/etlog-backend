import { body, validationResult } from "express-validator";
import Post from "../models/postModel.js";

// Cloudinary configuration
import { cloudinaryV2 } from "../cloudinary.js";

// Get all posts from db and populate them with their respecting user/author
const getAllPosts = async (req, res, next) => {
    try {
        const allBlogPosts = await Post.find().populate({path: 'User', select: 'name'}).sort({createdAt: -1});

        // Check if no post exists
        if (!allBlogPosts.length) {
            return res.status(404).json({ data: [] });
        };

        return res.status(200).json({data: allBlogPosts});

    } catch (error) {
        next(error);
    };
};  

// Get a single post
const getPostById = async (req, res, next) => {
    try {
        // Get a single post populatng with its author, comments and comment authors
        const singlePost = await Post.findById(req.params.postId)
            .populate({
                path: 'user',
                select: 'name email'
            })
            .populate({
                path: 'comment',
                populate: {
                    path: 'author',
                    select: 'name'
                }
            })

        // Check if no post exists with the given post id
        if (!singlePost) {
            return res.status(404).json({ data: null });
        };

        return res.status(200).json({data: singlePost});

    } catch (error) {
        next(error);
    };
};

// Create a post
const createPost = [
    // Sanitize and validate inputs
    body('title')
        .trim()
        .escape()
        .isLength({ min: 1, max: 200 })
        .withMessage('title must between 1 and 200 characters'),

    body('body', 'body is required')
        .escape()
        .trim(),

    body('category', 'category is required')
        .trim()
        .escape(),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                // Include file validation error if applicable
                if (!req.file) {
                    errors.errors.push({ param: 'coverImage', msg: 'Image is required' });
                };

                return res.status(422).json({message: 'validation errors', errors: errors.array()});
            };

            // Get post information and author id
            const { title, body, category } = req.body;
            const userId = req.user;

            // Ensure that file is present
            if (!req.file) {
                return res.status(422).json({message: 'image is required'});
            };

            // Set a maximum allowed file size
            const maxFileSize = 5 * 1024 * 1024;

            // Check if the file size exceeds the limit
            if (req.file.size > maxFileSize) {
                return res.status(413).json({ message: 'File size exceeds the limit' });
            }

            // Upload the cover image to Cloudinary
            const result = await cloudinaryV2.uploader.upload(req.file.buffer.toString('base64'), {
                folder: 'blog-posts',
            });

            const newPost = new Post({
                title,
                body,
                category,
                coverImage: result.secure_url,
                user: userId
            })

            await newPost.save();

            res.status(200).json({ message: 'Post created successfully', data: newPost });

        } catch (error) {
            next(error);
        }
    }
]

const updatePost = [
    // Validate and sanitize inputs
    body('title')
        .trim()
        .escape()
        .isLength({ min: 1, max: 200 })
        .withMessage('title must between 1 and 200 characters'),

    body('body', 'body is required')
        .escape()
        .trim(),

    body('category', 'category is required')
        .trim()
        .escape(),
    
    async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check for validation errors
            if (!errors.isEmpty()) {
                return res.status(422).json({ message: 'Validation error', errors: errors.array() });
            };
    
            const postId = req.params.postId;
            const { title, body, category } = req.body;
    
            // Ensure that the post ID is provided
            if (!postId) {
                return res.status(404).json({ message: 'Post ID is required' });
            };
    
            // Find the post by ID
            const existingPost = await Post.findById(postId);
    
            // Check if the post exists
            if (!existingPost) {
                return res.status(404).json({ message: 'Post not found' });
            };

            // Check if the authenticated user is the owner of the post
            if (existingPost.user.toString() !== req.user.toString()) {
                return res.status(403).json({ message: 'Forbidden. You are not the owner of this post.' });
            };
    
            // Update the post data
            existingPost.title = title || existingPost.title;
            existingPost.body = body || existingPost.body;
            existingPost.category = category || existingPost.category;
    
            // Check if a new cover image is provided
            if (req.file) {
                // Upload the new cover image to Cloudinary
                const result = await cloudinaryV2.uploader.upload(req.file.buffer.toString('base64'), {
                    folder: 'blog-posts',
                });
    
                existingPost.coverImage = result.secure_url;
            };
    
            // Save the updated post
            await existingPost.save();
    
            return res.status(200).json({ message: 'Post updated successfully', data: existingPost });
        } catch (error) {
            next(error);
        }
    }
]

// Delete a post
const deletePost = async (req, res, next) => {
    try {
        // Find a post by its id and delete
        await Post.findByIdAndDelete(req.params.postId);

        return res.status(204);
    } catch (error) {
        // Handle if post not found
        if(error.kind === "objectId") {
            return res.status(404).json({message:"Post not found"}); 
        }

        next(error);
    }
};


// Export post route middlewares
export {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost
}