import { body, validationResult } from "express-validator";
import Comment from "../models/commentModel.js"
import Post from "../models/postModel.js";
 
// Create a comment for a given post
const createComment = [
    // Sanitize and validate input
    body('text', 'body is required')
        .trim()
        .escape()
        .isLength({max: 1000})
        .withMessage('Comment must be lower than 1000 characters'),

    async (req, res, next) => {
        try {
            // Handle validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({message: "Validation errors", errors: errors.array()});
            };

            // Get comment information from request object
            const { text } = req.body;
            const postId = req.params.postId;
            const user = req.user;

            // Ensure post exists to comment
            const post = Post.findById(postId);

            if (!post) {
                return res.status(422).json({message: "No post to comment"});
            };

            // Create comment 
            const newComment = new Comment({
                text,
                post: postId,
                user
            });

            await newComment.save();

            return res.status(200).json({message: "Comment created", data: newComment});

        } catch (error) {
            next(error);
        }
    }
];

// Update a comment
const updateComment = [
    // Sanitize and validate input
    body('text', 'body is required')
        .trim()
        .escape()
        .isLength({max: 1000})
        .withMessage('Comment must be lower than 1000 characters'),
    
    async (req, res, next) => {
        try {
            // Handle validation errors
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.status(422).json({message: "Validation errors", errors: errors.array()});
            };

            // Get comment informations
            const text = req.body.text;
            const commentId = req.params.commentId;

            const commentExists = await Comment.findById(commentId);

            // Ensure that comment exists to update
            if (!commentExists) {
                return res.status(404).json({message: "No comment to update"});
            }

            // Update comment and save
            commentExists.text = text || commentExists.text;

            await commentExists.save();

            return res.status(200).json({message: "comment updated", data: commentExists})

        } catch (error) {
            next(error)
        };
    }
];

// Delete a comment
const deleteComment = async (req, res, next) => {
    try {
        // Find a comment by its id and delete
        await Comment.findByIdAndDelete(req.params.commentId)
        
        return res.status(204).json({ message: "Comment deleted successfully" });
    } catch (error) {

        // Handle if no comment exists
        if (error.kind === "objectId") {
            return res.status(404).json({message:"comment not found"}); 
        }

        // Handle unexpected errors
        next(error);
    }
};

export {
    getCommentsForPost,
    createComment,
    updateComment,
    deleteComment
}