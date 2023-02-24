const { expect } = require('chai');
const clearBinaries = require('../src/handlers/cachePublicClearBinary.js');
jest.mock('../src/handlers/helpers/messageSender.js', () => jest.fn());
const messageSender = require('../src/handlers/helpers/messageSender.js');

const mockPassingEvent = {
    "httpMethod":"POST","body":"[\r\n  {\r\n    \"page\": \"https://agwl-uat.acer.com/index\"\r\n  },\r\n  {\r\n    \"page\": \"https://agwl-uat.acer.com/index.html\"\r\n  }\r\n]","resource":"/pages","requestContext":{"resourceId":"123456","apiId":"1234567890","resourcePath":"/pages","httpMethod":"POST","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef","accountId":"123456789012","stage":"Prod","identity":{"apiKey":null,"userArn":null,"cognitoAuthenticationType":null,"caller":null,"userAgent":"Custom User Agent String","user":null,"cognitoIdentityPoolId":null,"cognitoAuthenticationProvider":null,"sourceIp":"127.0.0.1","accountId":null},"extendedRequestId":null,"path":"/pages","protocol":"HTTP/1.1","domainName":"127.0.0.1:3000","requestTimeEpoch":1613788481,"requestTime":"20/Feb/2021:02:34:41 +0000"},"queryStringParameters":null,"multiValueQueryStringParameters":null,"headers":{"Content-Type":"application/json","User-Agent":"PostmanRuntime/7.26.8","Accept":"*/*","Cache-Control":"no-cache","Postman-Token":"a9131be4-4dff-48fe-9c9f-17efa67406cd","Host":"127.0.0.1:3000","Accept-Encoding":"gzip, deflate, br","Connection":"keep-alive","Content-Length":"124","X-Forwarded-Proto":"http","X-Forwarded-Port":"3000"},"multiValueHeaders":{"Content-Type":["application/json"],"User-Agent":["PostmanRuntime/7.26.8"],"Accept":["*/*"],"Cache-Control":["no-cache"],"Postman-Token":["a9131be4-4dff-48fe-9c9f-17efa67406cd"],"Host":["127.0.0.1:3000"],"Accept-Encoding":["gzip, deflate, br"],"Connection":["keep-alive"],"Content-Length":["124"],"X-Forwarded-Proto":["http"],"X-Forwarded-Port":["3000"]},"pathParameters":null,"stageVariables":null,"path":"/pages","isBase64Encoded":false
}

describe('Clear Binaries tests', () => {
    test('passing', async () => {
        messageSender.mockImplementation(() => ({
            "ResponseMetadata": {
                "RequestId": "6bbc3086-9113-5526-a5c8-682ce254ebd6"
            },
            "Successful": [
                {
                    "Id": "45d82dac-4978-4f23-8871-35ef993733ee",
                    "MessageId": "fde529d3-8119-45d6-bdfb-469feceec558",
                    "MD5OfMessageBody": "50df9344f1b50f4ffeac0571db7d4a07",
                    "SequenceNumber": "18859873648015600128"
                },
                {
                    "Id": "4379d893-2c9e-435a-ad8d-61361575f9e0",
                    "MessageId": "1b47e665-054f-4b00-a75f-ca1d1cc266dc",
                    "MD5OfMessageBody": "8e5c410f6c446e05520f58f9e1cbc675",
                    "SequenceNumber": "18859873648015600129"
                }
            ],
            "Failed": []
        }));

        const result = await clearBinaries.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 200);
        const successfulProp = JSON.parse(result.body).Successful[0];
        expect(successfulProp).to.have.property('Id');
    })

    test('Clear Binaries - failing', async () => {
        messageSender.mockImplementation(() => undefined);

        const result = await clearBinaries.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 500);
        expect(result).to.have.property('body', undefined);
    })
})