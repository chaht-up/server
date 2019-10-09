import pool from '../../src/database/pool';

const seedMessages = async (values: string[]): Promise<void> => {
  const client = await pool.connect();
  await client.query('TRUNCATE messages');
  const valuesArray = values.map((_, i) => `($${i + 1})`).join(', ');
  await client.query(
    `INSERT INTO messages(text) VALUES ${valuesArray}`,
    values,
  );
  client.release();
};

export default seedMessages;
