import { Pool } from 'pg';

const { DATABASE_URL } = process.env;

const pool = new Pool({ connectionString: DATABASE_URL });

export default pool;
