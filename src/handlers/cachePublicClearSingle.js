const region = process.env.REGION
// *AWS*
AWS.config.update({ region: region });
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
var queueURL = process.env.SQS_URL;
const responseHelper = require('./helpers/responseHelper');
const messageBuilder = require('./helpers/messageBuilder');
const messageSender = require('./helpers/messageSender');

exports.handler = async (event) => {
  console.log("Event: "+ JSON.stringify(event));

  var params = {
    QueueUrl: queueURL,
    Entries: []
  };
  
  //cache or reload not being used anymore, just purge - proxy -> purge
  const key = event.pathParameters.proxy;
  const endpoint = 'purge/pages';
  

  try {
    if(key){
      params = await messageBuilder.buildMessage(params, key, endpoint);
      console.log(params);
      const sqsResults = await messageSender(params);
      const results = await responseHelper.buildResponse(sqsResults);
      return results;
    }
  }
  catch (error) {
    console.log(error);
  }

};