// src/index.ts
import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/root.route';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});