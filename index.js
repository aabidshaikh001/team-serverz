import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connectDB.js';
import router from './router/index.js';
import cookieParser from 'cookie-parser';
import { app, server } from './socket/index.js';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
    path: './.env',
});

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',  // Frontend origin
    credentials: true,  // Allow cookies to be sent across domains
}));
app.use(cookieParser());
app.use(express.json());  // Parse incoming JSON requests

// API routes
app.use('/api', router);

// --------deployment configuration--------
const _dirname1 = path.resolve();  // Resolve the directory name dynamically
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the frontend's build folder in production
    app.use(express.static(path.join(_dirname1, "/clientz/dist")));
    
    // Serve the React app for any unrecognized routes
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirname1, "clientz", "dist", "index.html"));
    });
} else {
    // For development, provide a simple API response for the root URL
    app.get('/', (req, res) => {
        res.send('API is Running Successfully');
    });
}
// --------deployment configuration--------

// Connect to MongoDB and start the server
connectDB()
    .then(() => {
        // Start the server after a successful DB connection
        server.listen(process.env.PORT, () => {
            console.log(`Server is running on PORT: ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB Connection failed !!!", err);
    });
