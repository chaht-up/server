import { getAllMessages } from '../../../../src/helpers/database';
import seedMessages from '../seedMessages';

describe('getAllMessages', () => {
  let pgClient;
  const values = [
    'hello',
    'is there anybody out there',
    'just nod if you can hear me',
  ];

  beforeAll(async () => {
    await seedMessages(values);
  });

  afterAll(async () => {
    await pgClient.release();
  });

  it('retrieves all messages from DB', async () => {
    const messages = await getAllMessages();
    expect(messages.map((m) => m.text)).toEqual(values);
  });
});
