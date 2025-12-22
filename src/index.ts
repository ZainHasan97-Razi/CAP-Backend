import express from "express";
import dotenv from 'dotenv';
import rootRouter from './routes/root.route';
import { connectDB } from "./database";
import { errorHandler } from "./middleware/error.handler";
import { allowingCors } from "./utils/allow.cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => allowingCors(req, res, next));

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'CORS is working!' });
});

// Middleware
app.use(express.json());
app.use("/api", rootRouter)
app.use(errorHandler);
connectDB();

app.listen(PORT, () => {
  console.log(`\x1b[34mServer is running on port:\x1b[0m \x1b[35m${PORT}\x1b[0m`);
});