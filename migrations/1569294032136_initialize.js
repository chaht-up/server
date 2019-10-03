exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('messages', {
    id: 'id',
    text: 'text NOT NULL',
    created_at: 'timestamp NOT NULL DEFAULT NOW()',
  });
};

exports.down = (pgm) => {
  pgm.dropTable('messages', { ifExists: true });
};
