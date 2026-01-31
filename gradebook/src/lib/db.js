import { neon } from '@neondatabase/serverless';

// Simple, direct connection using your connection string
const sql = neon(import.meta.env.VITE_DATABASE_URL);

export default sql;