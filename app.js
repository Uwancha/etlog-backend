/*
    An express api for etlog blog.
    The server provides api endpoints to blog posts,
    comments and user profiles
*/

import { config as configDotenv} from "dotenv";
import express from "express"
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import createError from "http-errors";
import session  from "express-session";
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";

configDotenv();

// Connect to databse
const mongoUri = process.env.MONGO_URI

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect(mongoUri, options);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "db connection error"))

db.once("open", () => {
    console.log("db successfully connected")
})

const app = express();

// Enablr CORS
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Secure the app
app.use(helmet());
app.use(compression())


// Rate limiting
const limit = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 20
})

app.use(limit);

// Get client
const client =  mongoose.connection.client

// Setup store
const store = new MongoStore({
    client
})

// Configure session
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: true,
        store,
        cookie: {
            secure: true,
            httpOnly: true,
            maxAge: 1000 * 60 * 24
        }
    })
);

// Content Security Policy(CSP)
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        connectSrc: ["'self'"],
        reportUri: '/report-violation'
      }
    })
);

// Routes
app.get("/", (req, res) => {
    res.send("Hello from the server")
});

// Handle 404 errors
app.use((req, res, next) => {
    next(createError(404, "Not found"))
});

// General error handler
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send("Internal server error")
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("Server started at port:", port)
});

