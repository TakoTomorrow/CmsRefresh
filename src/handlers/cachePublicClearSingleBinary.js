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
  
  const key = event.pathParameters.proxy;
  const endpoint = 'purge/binaries';

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