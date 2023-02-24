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

  const eventList = JSON.parse(event.body);
  const endpoint = 'purge/pages';
  
  try {
    eventList.forEach(async function (item) {
      if(item.key){
        params = await messageBuilder.buildMessage(params, item.page, endpoint); 
      }
    });
    console.log(params);
    const sqsResults = await messageSender(params);
    const results = await responseHelper.buildResponse(sqsResults);
    return results;
  }
  catch (error) {
    console.log(error);
  }

};