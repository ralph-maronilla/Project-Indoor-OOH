import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import app from './app.js';
import knex from './db/database.js';  // this binds knex to Objection

// Handle __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, "../../.env") });  // adjust relative path

console.log("Environment variables:", process.env);

const port = process.env.PORT_PROJECT_INDOOR_OOH || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
