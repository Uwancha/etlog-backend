import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import bcrypt from "bcryptjs"
import User from "../models/userModel.js";
import { config as configDotenv} from "dotenv";

configDotenv()

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password"}, 
        async (email, password, done) => {
            try {
                const user = await User.findOne({email});

                if (!user) {
                    return done(null, false, {message: "Incorrect email"});
                }

                const isMatch = await bcrypt.compare(password, user.password);

                if (!isMatch) {
                    return done(null, false, {message: "Incorrect password"});
                }

                return done(null, user);

            } catch (err) {
                return done(err);
            }
    } )
)

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWTSECRET,
}

passport.use(
    new Strategy(options, async (payload, done) => {
        try {
            const user = await User.findById(payload.userId)
            if (!user) {
                done(null, false)
            }

            return done(null, user)
        } catch (error) {
            done(error, null)
        }
        
    } )
)

export { passport }
