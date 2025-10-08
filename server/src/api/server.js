import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

import dotenv from 'dotenv';
import app from './app.js';
import knex from './db/database.js';  // this binds knex to Objection

const port = process.env.PORT_PROJECT_INDOOR_OOH || 3000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server running on port ${port}`);

});
