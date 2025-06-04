import { knexSnakeCaseMappers } from 'objection';
import Knex from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const knexConfig = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    user: process.env.DB_USER_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_SCHEMA_DEV,
  },
  ...knexSnakeCaseMappers(),
};

const knex = Knex(knexConfig);

export default knex;
