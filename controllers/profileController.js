import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { body, validationResult } from "express-validator";

// Cloudinary configuration
import { cloudinaryV2 } from "../cloudinary.js";

// Get a user profile
const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({data: null})
        };

        return res.status(200).json({data: user})
    } catch (error) {
        next(error)
    }
};

// Get user Posts
const getUserPosts = async (req, res, next) => {
    try {
        const userPosts = await Post.find({user: req.user});

        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({data: null})
        }
    } catch (error) {
        next(error)
    }
};

// Update user profile informations
const updateUserProfile = [
    body("name")
        .trim()
        .escape()
        .isLength({ min: 1, max: 200 })
        .withMessage("Name must be between 1 and 200 characters"),
    
    body("bio")
        .trim()
        .escape()
        .isLength({ max: 100 })
        .withMessage("Bio must be less than or equal to 100 characters"),
    
    body("education")
        .trim()
        .escape(),
    
    body("work")
        .trim()
        .escape(),
    
    async (req, res, next) => {
        try {
            // Handle validation errors
            const errors = validationResult(req);
    
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: "Validation error", errors: errors.array() });
            }
    
            // Destruct profile information from request object
            const { name, bio, education, work } = req.body;
            const userId = req.user;
    
            // Find the user
            const user = await User.findById(userId);
    
            // Handle if user doesn't exist
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Update user profile information
            user.name = name || user.name;
            user.profile.bio = bio || user.profile.bio;
            user.profile.education = education || user.profile.education;
            user.profile.work = work || user.profile.work;
    
            // Handle profile photo upload to Cloudinary
            if (req.file) {
                const result = await cloudinaryV2.uploader.upload(req.file.buffer.toString("base64"), {
                    folder: "user-profiles",
                });
    
                user.profile.profilePhoto = result.secure_url || user.profile.profilePhoto;
            }
    
            // Save the updated user
            await user.save();
    
            return res.status(200).json({ message: "User profile updated successfully", data: user });
        } catch (error) {
                next(error)
        }
    }
]

export { 
    getUserProfile,
    getUserPosts,  
    updateUserProfile 
};