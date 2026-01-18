import express from "express";
import dotenv from 'dotenv';
import path from 'path';
import rootRouter from './routes/root.route';
import { connectDB } from "./database";
import { errorHandler } from "./middleware/error.handler";
import { allowingCors } from "./utils/allow.cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => allowingCors(req, res, next));

// Middleware
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api", rootRouter)
app.use(errorHandler);
connectDB();

app.listen(PORT, () => {
  console.log(`\x1b[34mServer is running on port:\x1b[0m \x1b[35m${PORT}\x1b[0m`);
});