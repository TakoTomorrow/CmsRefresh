//const { expect } = require('chai');
const queueProcessor = require('../src/handlers/cachePrivateQueueProcessor.js');
const redisHelper = require('../src/handlers/helpers/redisHelper');
jest.mock('../src/handlers/helpers/redisHelper.js');
const AWS = require('aws-sdk-mock');

const mockPassingEventPurgePages = {
        "Records": [
            {
                "messageId": "5ad9f5be-9889-472a-98ad-d239a4a26709",
                "receiptHandle": "AQEBytkcLciBtcpbWzJMlMMWT0Wza0WY7fKYnHDlFmmk8cVkdcT8BfAy5wToqsJJkip2jHdByQ8zGcEwuLwjR1xxdg0Tb19R9DvXfvOh+1F+8Ba3VhoTTg6n0fpDlBUaZBS2hKQc5QosQ0gBRTTiALzM5kFEEY0km0b0ZcupIu874/OGnvIJV3giaLVWLa6giOoM5RGIXx2GV2AV06/BaRGlwBNVJfMBIupS/vjLNd+5xGPJjXBEUFCb2kc0OjOFzi3xUnxu0cqJQVI+xemvQJdtNNdg0y49PVFP6FHMRQUsOjsZli4lqHv9KC6BnGM5xUTg",
                "body": "{\"key\": \"https://agwl-uat.acer.com/media/Swift-5_KSP_1_71-3465.tif\", \"endpoint\": \"purge/pages\"}",
                "attributes": {
                    "ApproximateReceiveCount": "1",
                    "SentTimestamp": "1613760960743",
                    "SequenceNumber": "18859866879659760641",
                    "MessageGroupId": "purgeTest3",
                    "SenderId": "AROA4DA4QOAEUINQMCNGI",
                    "MessageDeduplicationId": "0072c683e13f1a44038d003d71647f1400638b140c48f0708c43318b482cdccf",
                    "ApproximateFirstReceiveTimestamp": "1613761012823"
                },
                "messageAttributes": {},
                "md5OfBody": "8e5c410f6c446e05520f58f9e1cbc675",
                "eventSource": "aws:sqs",
                "eventSourceARN": "arn:aws:sqs:ap-northeast-1:831135969289:ACER-CACHEBUSTER-UAT.fifo",
                "awsRegion": "ap-northeast-1"
            }
        ]
}

const mockPassingEventPurgeBinaries = {
    "Records": [
        {
            "messageId": "5ad9f5be-9889-472a-98ad-d239a4a26709",
            "receiptHandle": "AQEBytkcLciBtcpbWzJMlMMWT0Wza0WY7fKYnHDlFmmk8cVkdcT8BfAy5wToqsJJkip2jHdByQ8zGcEwuLwjR1xxdg0Tb19R9DvXfvOh+1F+8Ba3VhoTTg6n0fpDlBUaZBS2hKQc5QosQ0gBRTTiALzM5kFEEY0km0b0ZcupIu874/OGnvIJV3giaLVWLa6giOoM5RGIXx2GV2AV06/BaRGlwBNVJfMBIupS/vjLNd+5xGPJjXBEUFCb2kc0OjOFzi3xUnxu0cqJQVI+xemvQJdtNNdg0y49PVFP6FHMRQUsOjsZli4lqHv9KC6BnGM5xUTg",
            "body": "{\"key\": \"https://agwl-uat.acer.com/media/Swift-5_KSP_1_71-3465.tif\", \"endpoint\": \"purge/binaries\"}",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1613760960743",
                "SequenceNumber": "18859866879659760641",
                "MessageGroupId": "purgeTest3",
                "SenderId": "AROA4DA4QOAEUINQMCNGI",
                "MessageDeduplicationId": "0072c683e13f1a44038d003d71647f1400638b140c48f0708c43318b482cdccf",
                "ApproximateFirstReceiveTimestamp": "1613761012823"
            },
            "messageAttributes": {},
            "md5OfBody": "8e5c410f6c446e05520f58f9e1cbc675",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:ap-northeast-1:831135969289:ACER-CACHEBUSTER-UAT.fifo",
            "awsRegion": "ap-northeast-1"
        }
    ]
}

const mockPassingEventEmpty = {
    "Records": [
        {
            "messageId": "5ad9f5be-9889-472a-98ad-d239a4a26709",
            "receiptHandle": "AQEBytkcLciBtcpbWzJMlMMWT0Wza0WY7fKYnHDlFmmk8cVkdcT8BfAy5wToqsJJkip2jHdByQ8zGcEwuLwjR1xxdg0Tb19R9DvXfvOh+1F+8Ba3VhoTTg6n0fpDlBUaZBS2hKQc5QosQ0gBRTTiALzM5kFEEY0km0b0ZcupIu874/OGnvIJV3giaLVWLa6giOoM5RGIXx2GV2AV06/BaRGlwBNVJfMBIupS/vjLNd+5xGPJjXBEUFCb2kc0OjOFzi3xUnxu0cqJQVI+xemvQJdtNNdg0y49PVFP6FHMRQUsOjsZli4lqHv9KC6BnGM5xUTg",
            "body": "{\"key\": \"https://agwl-uat.acer.com/media/Swift-5_KSP_1_71-3465.tif\", \"endpoint\": \"\"}",
            "attributes": {
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1613760960743",
                "SequenceNumber": "18859866879659760641",
                "MessageGroupId": "purgeTest3",
                "SenderId": "AROA4DA4QOAEUINQMCNGI",
                "MessageDeduplicationId": "0072c683e13f1a44038d003d71647f1400638b140c48f0708c43318b482cdccf",
                "ApproximateFirstReceiveTimestamp": "1613761012823"
            },
            "messageAttributes": {},
            "md5OfBody": "8e5c410f6c446e05520f58f9e1cbc675",
            "eventSource": "aws:sqs",
            "eventSourceARN": "arn:aws:sqs:ap-northeast-1:831135969289:ACER-CACHEBUSTER-UAT.fifo",
            "awsRegion": "ap-northeast-1"
        }
    ]
}

describe('Queue Processor tests', () => {
    // afterAll(async done => {
    //     //done(); //seeing if this stops tests
    //     redisHelper.quit.mockResolvedValue(true);
    //     redisHelper.quit();
    //     done();
    // })
    test('Queue Processor - purge/pages - passing', async () => {
        process.env.SQS_URL = 'test.queue.com'
        AWS.mock('SQS', 'deleteMessage', function(params) {
            console.log("message successfully deleted from queue");
            return true;
        })
        redisHelper.exists.mockResolvedValue(1);
        redisHelper.del.mockResolvedValue(true);
        redisHelper.on.mockResolvedValue(true);
        const result = queueProcessor.handler(mockPassingEventPurgePages);
    });

    test('Queue Processor - purge/binaries - passing', async () => {
        process.env.SQS_URL = 'test.queue.com'
        AWS.mock('SQS', 'deleteMessage', function(params) {
            console.log("message successfully deleted from queue");
            return true;
        })
        redisHelper.exists.mockResolvedValue(1);
        redisHelper.del.mockResolvedValue(true);
        redisHelper.on.mockResolvedValue(true);
        const result = queueProcessor.handler(mockPassingEventPurgeBinaries);
    });

    test('Queue Processor - no endpoint - passing', async () => {
        process.env.SQS_URL = 'test.queue.com'
        AWS.mock('SQS', 'deleteMessage', function(params) {
            console.log("message successfully deleted from queue");
            return true;
        })
        redisHelper.exists.mockResolvedValue(1);
        redisHelper.del.mockResolvedValue(true);
        redisHelper.on.mockResolvedValue(true);
        const result = queueProcessor.handler(mockPassingEventEmpty);
    });

    test('Queue Processor - key does not exist - passing', async () => {
        process.env.SQS_URL = 'test.queue.com'
        AWS.mock('SQS', 'deleteMessage', function(params) {
            console.log("message successfully deleted from queue");
            return true;
        })
        redisHelper.exists.mockResolvedValue(0);
        redisHelper.del.mockResolvedValue(true);
        redisHelper.on.mockResolvedValue(true);
        const result = queueProcessor.handler(mockPassingEventEmpty);
    });

    test('Queue Processor - redis exists error - failing', async () => {
        process.env.SQS_URL = 'test.queue.com'
        AWS.mock('SQS', 'deleteMessage', function(params) {
            console.log("message successfully deleted from queue");
            return true;
        })
        err = 'error on redis exists method'
        redisHelper.exists.mockResolvedValue(err);
        redisHelper.del.mockResolvedValue(true);
        redisHelper.on.mockResolvedValue(true);
        const result = queueProcessor.handler(mockPassingEventEmpty);
    });

    // test('Queue Builder - failing', async () => {
    //     //redisHelper.mockImplementation(() => undefined);

    //     const result = queueProcessor.handler(mockPassingEvent);
    // })
})