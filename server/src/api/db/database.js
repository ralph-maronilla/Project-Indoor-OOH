import { Model } from 'objection';
import knex from '../../../knexfile.js';  // adjust path if needed

Model.knex(knex);

export default knex;