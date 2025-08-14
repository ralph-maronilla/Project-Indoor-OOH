import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import imageRoutes from './routes/imageRoute.js';

const app = express();

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://portal.davidandgolyat.com:7110",
      "http://portal.davidandgolyat.com:7110/"
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition", "Content-Type"],
  })
);


// Routes
app.use('/api/v1/images', imageRoutes);

app.use("/api/v1/auth", authRoutes);

// Custom Error Handler
app.use(errorHandler);

export default app;
