import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import sessionRoutes from "./routes/session.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(
//     cors({
//         origin: "http://localhost:5173", // your Vite frontend
//         credentials: true,
//         methods: ["GET", "POST", "PUT", "DELETE"], // optional, good to be explicit
//     })
// );

app.use(
    cors({
        origin: "*", // Allow all origins
        credentials: true, // Allow credentials (cookies)
        methods: ["GET", "POST", "PUT", "DELETE"], // Optional, good to be explicit
    })
);

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);
app.use("/api/session", sessionRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running on port: ", PORT);
});
