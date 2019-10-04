import server from '../src';
import pool from '../src/database/pool';

module.exports = () => pool.end().then(() => {
  server.close();
});
