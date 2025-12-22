import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import rootRouter from './routes/root.route';
import { connectDB } from "./database";
import { errorHandler } from "./middleware/error.handler";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use("/api", rootRouter)
app.use(errorHandler);
connectDB();

app.listen(PORT, () => {
  // console.log(`Server is running on port: \x1b[35m${PORT}\x1b[0m`);
  console.log(`\x1b[34mServer is running on port:\x1b[0m \x1b[35m${PORT}\x1b[0m`);
});