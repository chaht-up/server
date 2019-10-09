import { expect } from 'chai';
import { insertMessage } from '../../../src/database';

describe('insertMessage', () => {
  it('inserts messages into the dataase', async () => {
    const { id, text, createdAt } = await insertMessage('howdy pardner', null);
    expect(typeof id).to.eql('number');
    expect(id).not.to.eql(NaN);
    expect(typeof text).to.eql('string');
    expect(createdAt).to.be.instanceOf(Date);
  });
});
