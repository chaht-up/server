import { getAllMessages } from '../../../src/helpers/database';
import seedMessages from './seedMessages';

describe('getAllMessages', () => {
  const values = [
    'hello',
    'is there anybody out there',
    'just nod if you can hear me',
  ];

  beforeAll(async () => {
    await seedMessages(values);
  });

  it('retrieves all messages from DB', async () => {
    const messages = await getAllMessages();
    expect(messages.map((m) => m.text)).toEqual(values);
  });
});
