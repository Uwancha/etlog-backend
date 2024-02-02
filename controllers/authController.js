import User from "../models/userModel.js";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import passport from "passport";
import Jwt from "jsonwebtoken";
import { config as configDotenv} from "dotenv";

configDotenv()

// Middleware to hash the password
const hashPassword = async (req, res, next) => {
    const password = req.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);

    req.body.password = hashedPassword;

    next();
}

// Signup route middleware
const signup = [
    body("name", "Name is required")
        .escape()
        .isLength({min: 3})
        .withMessage("Name must be greater than 2 charcters"),

    body("email", "email is required")
        .escape()
        .isEmail()
        .withMessage("Not a valid email"),

    body("password", "password is required")
        .escape()
        .isLength({min: 8})
        .withMessage("Password must be at least 8 charcters"),

    hashPassword,

    async (req, res, next) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            const userExists = await User.findOne({email: req.body.email});

            if (userExists) {
                return res.status(400).json({error: "User already exists"})
            }

            const user = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            });

            await user.save();

            res.json({message: "User created successfully", user});

        } catch (err) {
            next(err)
        }
    }


];

// Login route middleware
const login = async (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.status(401).json({message: "Authentication failed", info})
        }

        req.logIn(user, (loginerror) => {
            if (loginerror) {
                return next(loginerror)
            }

            const jwtSecret = process.env.JWTSECRET
            const token = Jwt.sign({userId: user.id}, jwtSecret,)
            
            return res.status(200).json({message: "Successfull login", user, token})
        });

    })(req, res, next)
};

export { signup, login };