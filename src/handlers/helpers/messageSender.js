const region = process.env.REGION

var AWS = require('aws-sdk');
// *AWS*
AWS.config.update({ region: region });
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});

module.exports = async function sendSQSMessage(params) {
    try {
        const result = await sqs.sendMessageBatch(params).promise();
        return result; 
    }
    catch (error) {
        console.log(JSON.stringify(error));
        return error;
    }
}