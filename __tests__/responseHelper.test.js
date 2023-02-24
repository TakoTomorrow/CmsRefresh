//jest.mock('../src/handlers/cachePrivateQueueBuilder.js', jest.fn());
const responseHelper = require('../src/handlers/helpers/responseHelper.js');
//jest.mock('../src/handlers//helpers/responseHelper.js');

const passResponse = {
    ResponseMetadata: {
        "RequestId": "41f15196-86bf-58ee-9731-093e4ab7b4d1"
    },
    Successful: [
        {
            Id: "1ae3548a-1c61-49ab-9870-bbba8904756e",
            MessageId: "f3d5fcdb-6032-4dfb-8f4f-1c3e5725a29d",
            MD5OfMessageBody: "9e1e616be0d24f6bc6236ac5439820ec",
            SequenceNumber: "18859845890675951616"
        },
        {
            Id: "5cf6f907-a954-4eb1-bd1d-98168a910da6",
            MessageId: "b50f0d58-6652-4f60-b3c3-f56e96c70c4c",
            MD5OfMessageBody: "6288344547c5e4a482a7d1ceba7772dc",
            SequenceNumber: "18859845890675951617"
        },
        {
            Id: "b54077d7-c99e-4c42-adbe-d550f9e0f88b",
            MessageId: "856f5e1d-2206-4cad-8d8b-fb7138ee9480",
            MD5OfMessageBody: "950718adf1187c6277ba28933b44c916",
            SequenceNumber: "18859845890675951618"
        }
    ],
    Failed: []
}

const failResponse = 'asdfasdf';

describe('responseHelper tests', () => {
    test('buildResponse', async () => {
        const result = await responseHelper.buildResponse(passResponse);
        const resultBody = JSON.parse(result.body);
        console.log(resultBody);
        expect(resultBody).toHaveProperty('Successful');
    })

    test('buildErrorResponse', async () => {
        const result = await responseHelper.buildResponse(failResponse);
        const resultBody = result;
        console.log(resultBody);
        expect(resultBody).not.toHaveProperty('Successful');
    })

    test('buildErrorResponse', async () => {
        const result = await responseHelper.buildResponse();
        expect(result).not.toHaveProperty('Successful');
    })

    afterEach(() => {
        jest.restoreAllMocks();
    });
})
