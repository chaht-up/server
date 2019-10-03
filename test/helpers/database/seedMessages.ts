// eslint-disable-next-line no-unused-vars
import pool from '../../../src/helpers/database/pool';

const seedMessages = async (values: string[]): Promise<void> => {
  const client = await pool.connect();
  await client.query('TRUNCATE messages');
  const valuesArray = values.map((_, i) => `($${i + 1})`).join(', ');
  await client.query(
    `INSERT INTO messages(text) VALUES ${valuesArray}`,
    values,
  );
  await client.release();
};

export default seedMessages;
