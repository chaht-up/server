/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createExtension('uuid-ossp', { notExists: true });
  pgm.createTable('sessions', {
    id: 'id',
    user_id: 'int REFERENCES users ON DELETE CASCADE',
    token: 'uuid NOT NULL DEFAULT uuid_generate_v4()',
    is_active: 'boolean NOT NULL DEFAULT true',
    created_at: 'timestamp NOT NULL DEFAULT now()',
  });
};

exports.down = (pgm) => {
  pgm.dropTable('sessions', { notExists: true });
  pgm.dropExtension('uuid-ossp', { notExists: true });
};
