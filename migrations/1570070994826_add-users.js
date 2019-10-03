/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    username: 'varchar(40) UNIQUE NOT NULL',
    created_at: 'timestamp NOT NULL DEFAULT NOW()',
  });
  pgm.createTable('user_secrets', {
    id: 'id',
    user_id: 'integer REFERENCES users ON DELETE CASCADE',
    password: 'varchar(60) NOT NULL',
    created_at: 'timestamp NOT NULL DEFAULT NOW()',
  });
  pgm.addColumn('messages', {
    user_id: 'integer REFERENCES users',
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('messages', ['user_id'], { ifExists: true });
  pgm.dropTable('user_secrets', { ifExists: true });
  pgm.dropTable('users', { ifExists: true });
};
