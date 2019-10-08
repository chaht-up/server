import { insertMessage } from '../../../src/database';

describe('insertMessage', () => {
  it('inserts messages into the dataase', async () => {
    const { id, text, createdAt } = await insertMessage('howdy pardner', null);
    expect(typeof id).toBe('number');
    expect(id).not.toBeNaN();
    expect(typeof text).toBe('string');
    expect(createdAt).toBeInstanceOf(Date);
  });
});
