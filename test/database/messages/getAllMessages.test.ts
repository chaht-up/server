import { expect } from 'chai';
import { getAllMessages } from '../../../src/database';
import seedMessages from '../../helpers/seedMessages';

const has = Object.prototype.hasOwnProperty;

describe('getAllMessages', () => {
  const values = [
    'hello',
    'is there anybody out there',
    'just nod if you can hear me',
  ];

  before(async () => {
    await seedMessages(values);
  });

  it('retrieves all messages from DB', async () => {
    const messages = await getAllMessages();
    expect(messages.map((m) => m.text)).to.eql(values);
    expect(messages.every((m) => has.call(m, 'senderId'))).to.eql(true);
    expect(messages.every((m) => has.call(m, 'id'))).to.eql(true);
    expect(messages.every((m) => has.call(m, 'sentAt'))).to.eql(true);
  });
});
