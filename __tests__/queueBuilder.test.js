const { expect } = require('chai');
const queueBuilder = require('../src/handlers/cachePrivateQueueBuilder.js');
jest.mock('../src/handlers/helpers/messageSender.js', () => jest.fn());
const messageSender = require('../src/handlers/helpers/messageSender.js');

const mockPassingEvent = {
    "httpMethod":"POST","body":"[\r\n  {\r\n    \"page\": \"https://agwl-uat.acer.com/index\",\r\n    \"binary\": \"https://agws-dev.acer.com/media/logo_wifi6_71-3917.png\",\r\n    \"endpoint\": \"reload/pages\",\r\n    \"messageGroupId\": \"purgeTest3\"\r\n  },\r\n  {\r\n    \"page\": \"https://agwl-uat.acer.com/index\",\r\n    \"binary\": \"https://agws-dev.acer.com/media/Swift-5_KSP_1_71-3465.tif\",\r\n    \"endpoint\": \"reload/pages\",\r\n    \"messageGroupId\": \"purgeTest3\"\r\n  }\r\n]","resource":"/cache/pages","requestContext":{"resourceId":"123456","apiId":"1234567890","resourcePath":"/cache/pages","httpMethod":"POST","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef","accountId":"123456789012","stage":"Prod","identity":{"apiKey":null,"userArn":null,"cognitoAuthenticationType":null,"caller":null,"userAgent":"Custom User Agent String","user":null,"cognitoIdentityPoolId":null,"cognitoAuthenticationProvider":null,"sourceIp":"127.0.0.1","accountId":null},"extendedRequestId":null,"path":"/cache/pages","protocol":"HTTP/1.1","domainName":"127.0.0.1:3000","requestTimeEpoch":1613777728,"requestTime":"19/Feb/2021:23:35:28 +0000"},"queryStringParameters":null,"multiValueQueryStringParameters":null,"headers":{"Content-Type":"application/json","User-Agent":"PostmanRuntime/7.26.8","Accept":"*/*","Cache-Control":"no-cache","Postman-Token":"9d051045-32b4-46a6-9296-7d8ca4bfd7a0","Host":"127.0.0.1:3000","Accept-Encoding":"gzip, deflate, br","Connection":"keep-alive","Content-Length":"408","X-Forwarded-Proto":"http","X-Forwarded-Port":"3000"},"multiValueHeaders":{"Content-Type":["application/json"],"User-Agent":["PostmanRuntime/7.26.8"],"Accept":["*/*"],"Cache-Control":["no-cache"],"Postman-Token":["9d051045-32b4-46a6-9296-7d8ca4bfd7a0"],"Host":["127.0.0.1:3000"],"Accept-Encoding":["gzip, deflate, br"],"Connection":["keep-alive"],"Content-Length":["408"],"X-Forwarded-Proto":["http"],"X-Forwarded-Port":["3000"]},"pathParameters":null,"stageVariables":null,"path":"/cache/pages","isBase64Encoded":false
}

describe('Queue Builders tests', () => {
    test('Queue Builder - passing', async () => {
        messageSender.mockImplementation(() => ({
            "ResponseMetadata": {
                "RequestId": "11e03e80-f1a7-59e6-abe4-662a85886b56"
            },
            "Successful": [
                {
                    "Id": "5daefc44-5479-4b8f-b69f-e85615d4e913",
                    "MessageId": "0df76d9b-1c61-474d-9b51-b1d8a2f47e6d",
                    "MD5OfMessageBody": "5a12b9c810a052412deeecfe207ad7ab",
                    "SequenceNumber": "18859873707427570432"
                },
                {
                    "Id": "31dc75e1-4803-411b-996e-1509eac0962e",
                    "MessageId": "55c2fa27-750b-4446-8ded-5048c1903c17",
                    "MD5OfMessageBody": "891fd776e5556b56d6694758bbf7dc4c",
                    "SequenceNumber": "18859873707427570433"
                },
                {
                    "Id": "02bd435d-f074-44b9-a871-10957ef0fb6a",
                    "MessageId": "b86263a4-7503-43d1-b609-bf247d1a802c",
                    "MD5OfMessageBody": "2751e6d69dd9328b163a9001de372d94",
                    "SequenceNumber": "18859873707427570434"
                }
            ],
            "Failed": []
        }));

        const result = await queueBuilder.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 200);
        const successfulProp = JSON.parse(result.body).Successful[0];
        expect(successfulProp).to.have.property('Id');
    });

    test('Queue Builder - failing', async () => {
        messageSender.mockImplementation(() => undefined);

        const result = await queueBuilder.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 500);
        expect(result).to.have.property('body', undefined);
    })
})