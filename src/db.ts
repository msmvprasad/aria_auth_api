import knex, { Knex } from 'knex';

/**
 * Create a Knex instance using environment variables for configuration.  This
 * file centralizes the database connection so it can be easily imported
 * elsewhere in your application.  The configuration defaults are sensible
 * for local development but can be overridden via environment variables.
 */
const dbConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test'
  }
};

const db = knex(dbConfig);

export default db;