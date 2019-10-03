import server from '../src';
import pool from '../src/helpers/database/pool';

module.exports = () => pool.end().then(() => {
  server.close();
});
