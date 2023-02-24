const { expect } = require('chai');
const clearSinglePage = require('../src/handlers/cachePublicClearSingle.js');
jest.mock('../src/handlers/helpers/messageSender.js', () => jest.fn());
const messageSender = require('../src/handlers/helpers/messageSender.js');

const mockPassingEvent = {
    "httpMethod":"GET","body":null,"resource":"/page/{proxy+}","requestContext":{"resourceId":"123456","apiId":"1234567890","resourcePath":"/page/{proxy+}","httpMethod":"GET","requestId":"c6af9ac6-7b61-11e6-9a41-93e8deadbeef","accountId":"123456789012","stage":"Prod","identity":{"apiKey":null,"userArn":null,"cognitoAuthenticationType":null,"caller":null,"userAgent":"Custom User Agent String","user":null,"cognitoIdentityPoolId":null,"cognitoAuthenticationProvider":null,"sourceIp":"127.0.0.1","accountId":null},"extendedRequestId":null,"path":"/page/{proxy+}","protocol":"HTTP/1.1","domainName":"127.0.0.1:3000","requestTimeEpoch":1613788775,"requestTime":"20/Feb/2021:02:39:35 +0000"},"queryStringParameters":null,"multiValueQueryStringParameters":null,"headers":{"User-Agent":"PostmanRuntime/7.26.8","Accept":"*/*","Cache-Control":"no-cache","Postman-Token":"c9a65b81-4887-4085-bb9b-2bdaccd9bb73","Host":"127.0.0.1:3000","Accept-Encoding":"gzip, deflate, br","Connection":"keep-alive","X-Forwarded-Proto":"http","X-Forwarded-Port":"3000"},"multiValueHeaders":{"User-Agent":["PostmanRuntime/7.26.8"],"Accept":["*/*"],"Cache-Control":["no-cache"],"Postman-Token":["c9a65b81-4887-4085-bb9b-2bdaccd9bb73"],"Host":["127.0.0.1:3000"],"Accept-Encoding":["gzip, deflate, br"],"Connection":["keep-alive"],"X-Forwarded-Proto":["http"],"X-Forwarded-Port":["3000"]},"pathParameters":{"proxy":"https://agws-dev.intra.acer.com"},"stageVariables":null,"path":"/page/https://agws-dev.intra.acer.com/media/Swift-5_KSP_1_71-3465.tif","isBase64Encoded":false
}

describe('Clear Single Page tests', () => {
    test('Clear Single Page - passing', async () => {
        messageSender.mockImplementation(() => ({
            "ResponseMetadata": {
                "RequestId": "7a74ff8d-4be3-5f90-b6b8-a727335eb422"
            },
            "Successful": [
                {
                    "Id": "00c1cc8a-62fc-4acd-9bdd-88344ddff7cb",
                    "MessageId": "6608d090-56c5-4112-8521-98615c418e3d",
                    "MD5OfMessageBody": "e3b55c41e2450d8f54d86336942a8fb0",
                    "SequenceNumber": "18859874005828335616"
                }
            ],
            "Failed": []
        }));

        const result = await clearSinglePage.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 200);
        const successfulProp = JSON.parse(result.body).Successful[0];
        expect(successfulProp).to.have.property('Id');
    })

    test('Clear Single Page - failing', async () => {
        messageSender.mockImplementation(() => undefined);

        const result = await clearSinglePage.handler(mockPassingEvent);
        expect(result).to.have.property('statusCode', 500);
        expect(result).to.have.property('body', undefined);
    })
})