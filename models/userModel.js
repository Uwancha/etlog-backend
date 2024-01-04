import mongoose from "mongoose";

const Schema = mongoose.Schema

/**
 * UserSchema represents the structure of a user in the application.
 * It includes name, email, password and optional profile informations.
 */

const UserSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: true,
            maxLength: 200
        },
        email: {
            type: String,
            unique: true, 
            required: true
        },
        password: {
            type: String, 
            required: true, 
            minLength: 8
        },

        // Optional profile fields the user can fill after signing up
        profile: {
            bio: {
                type: String, 
                maxLength: 100
            },
            profilePhoto: {
                type: String
            },
            education: {
                type: String
            },
            work: {
                type: String
            }

        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("user", UserSchema);

export default User;

