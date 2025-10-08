import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cors from "cors";
import imageRoutes from './routes/imageRoute.js';
import submissionRoutes from './routes/submissionRoute.js';
import oohRoutes from './routes/oohRoutes.js';

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
      "http://portal.davidandgolyat.com:7110/",
      "http://portal.davidandgolyat.com:7163/",
      "http://13.229.21.195:7163/",
      "http://portal.davidandgolyat.com:7108/",
      "http://13.229.21.195:7108/",
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition", "Content-Type"],
  })
);
app.options("*", cors());


// Routes
app.use('/api/v1/images', imageRoutes);

app.use("/api/v1/auth", authRoutes);

app.use('/api/v1/submissions', submissionRoutes);

app.use('/api/v1/ooh', oohRoutes);

// Custom Error Handler
app.use(errorHandler);

export default app;
