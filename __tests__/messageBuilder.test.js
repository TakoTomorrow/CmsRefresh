const messageBuilder = require('../src/handlers/helpers/messageBuilder.js');

describe('messageBuilder tests', () => {
    test('build SQS Message - passing', async () => {
        
        const mockPassingParams = {
            QueueUrl: 'http://www.a.sqs.instance.com',
            Entries: [] 
        }
        const testKey = 'testKey';
        const testEndpoint = 'purge/tests';

        const result = await messageBuilder.buildMessage(mockPassingParams, testKey, testEndpoint);
        console.log(result);
        const resultMessageBody = JSON.parse(result.Entries[0].MessageBody);
        expect(resultMessageBody).toHaveProperty('key');
    })

    afterEach(() => {
        jest.restoreAllMocks();
    });
})