import mongoose from "mongoose";

const Schema = mongoose.Schema;

/*
 * CommentSchema represents the structure of a comment in the application.
 * It includes the body of the comment, the user who authored it, and the post to which it belongs.
 * Validation is implemented to ensure the existence of referenced user and post.
 */

const CommentSchema = new Schema(
    {
        body: {
            type: String, 
            required: true,
            maxLength: 500,
        },

        // The user who authored the comment (referenced by their ObjectId)
        user: {
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true,

            // Validation ensures that the referenced user exists
            validate: {
                validator: async (userId) => {
                    // Check if the user with the given ID exists
                    const user = await mongoose.models.User.findById(userId);
                    return user !== null
                },
                message: "User does not exist"
            }
        },

        // The post to which the comment belongs (referenced by its ObjectId)
        post: {
            type: Schema.Types.ObjectId, 
            required: true,
            ref: "Post",
    
            // Validation ensures that the referenced post exists
            validate: {
                validator: async (postId) => {
                    // Check if the post with the given ID exists
                    const post = await mongoose.models.Post.findById(postId);
                    return post !== null
                },
                message: "Post does not exist"
            }
        }
    },
    {
        timestamps: true
    }
);

const Comment = mongoose.model("Comment", CommentSchema);

export default Comment;

