import pool from '../../../src/helpers/database/pool';

const seedMessages = async (values: string[]): Promise<void> => {
  await pool.query('TRUNCATE messages');
  const valuesArray = values.map((_, i) => `($${i + 1})`).join(', ');
  await pool.query(
    `INSERT INTO messages(text) VALUES ${valuesArray}`,
    values,
  );
};

export default seedMessages;
