/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('messages', {
    sender_id: 'int REFERENCES users',
  });
  pgm.dropColumn('messages', 'user_id', { ifExists: true });
};

exports.down = (pgm) => {
  pgm.dropColumn('messages', 'sender_id');
  pgm.addColumn('messages', {
    user_id: 'int REFERENCES users',
  }, { ifNotExists: true });
};
