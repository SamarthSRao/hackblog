import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

// Connection pool configuration
const client = postgres(connectionString, {
    max: 10, // Maximum number of connections
    idle_timeout: 20,
    connect_timeout: 10,
});

// Create Drizzle instance
export const db = drizzle(client, { schema });

// Export schema for use in queries
export * from './schema.js';
