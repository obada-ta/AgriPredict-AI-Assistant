import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import companyRoutes from './router/companyRouter.js'
import postRoutes from "./router/postRoutes.js";
import commentRoutes from "./router/commentRoutes.js";
import likeRoutes from "./router/likeRoutes.js";
import chatRoutes from "./router/chatRoutes.js";
import notificationRoutes from "./router/notificationRoutes.js";
import analyzeLandRouter from './router/analyzeLandRouter.js'
import connectDb from "./config/connectionDb.js";
import authRouter from './router/authRouter.js'
import imagePredictRoutes from './router/imagePredictRoutes.js'
import feedbackRoutes from './router/feedbackRouter.js'
import { query } from "express-validator";
import { fileURLToPath } from 'url';
import path from 'path'
import { server, app } from './lib/socket.js' // Import server instead of creating new one

dotenv.config();

const port = process.env.PORT || 3000;

connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));

// أو بشكل عام


app.use('/api/auth', authRouter);
app.use("/api/company", companyRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/land", analyzeLandRouter);
app.use("/api/ai", imagePredictRoutes);
app.use("/api/feedbacks", feedbackRoutes);

app.get('/hello', query('person').notEmpty(), (req, res) => {
  res.send(`Hello, ${req.query.person}!`);
});

app.get('/ali', (req, res) => {
  res.json({ message: "mohammad ali " })
});

// ✅ Use the server from socket.js instead of creating a new one
// server.listen(port, () => {
//   console.log(`Server is listening on ${port}`)
// });
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on `)
});