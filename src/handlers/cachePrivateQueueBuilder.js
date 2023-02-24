
var queueURL = process.env.SQS_URL;
const responseHelper = require('./helpers/responseHelper');
const messageBuilder = require('./helpers/messageBuilder');
const messageSender = require('./helpers/messageSender');

exports.handler = async (event) => {
  console.log("Event: "+ JSON.stringify(event));
  //console.log("TYPE: " + typeof(event.body)); // string
  //console.log(JSON.parse(event.body));
  const eventListWithWhitespace = event.body.replace(/(\r\n|\n|\r)/gm, "");
  const eventListCleaned = eventListWithWhitespace.replace(/[\u200B-\u200D\uFEFF]/g, '');
  console.log("Body Cleaned: " + eventListCleaned)

  var params = {
    QueueUrl: queueURL,
    Entries: []
  };

  const eventList = JSON.parse(eventListCleaned);
  const page = eventList[0].page;
  const binaryEndpoint = 'purge/binaries';
  const pageEndpoint = 'purge/pages';

  try {
    eventList.forEach(async function(item){
      if(item.key){
        params = await messageBuilder.buildMessage(params, item.binary, binaryEndpoint); 
      }
    });
    params = await messageBuilder.buildMessage(params, page, pageEndpoint);
    console.log(params);
    const sqsResults = await messageSender(params);
    const results = await responseHelper.buildResponse(sqsResults);
    console.log(results);
    return results;
  } 
  catch (error) {
    console.log(error);
  }

};