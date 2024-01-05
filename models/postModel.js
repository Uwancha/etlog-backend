import mongoose from "mongoose";

const Schema = mongoose.Schema

/**
 * PostSchema represents the structure of a post in the application.
 * It includes the title, body, cover image and the user who authored it.
 * Validation is implemented to ensure the existence of referenced user.
 */

const PostSchema = new Schema(
    {
        title: {
            type: String, 
            required: true, 
            maxLength: 200
        }, 
        body: {
            type: String, 
            required: true
        },
        coverImage: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },

        // The user who authored the post (referenced by their ObjectId)
        user: {
            type: Schema.Types.ObjectId, 
            ref: "User",
            required: true,

            // Validation ensures that the referenced user exists
            validate: {
                validator: async (userId) => {
                    // Checks if the user with given id exists
                    const user = await mongoose.models.User.findById(userId);
                    return user !== null
                },
                message: "User does not exist"
            }
        }
    }, 
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", PostSchema);

export default Post;

