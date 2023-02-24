const { v4: uuidv4 } = require('uuid');

async function buildMessage(params, key, endpoint) {
  const tempId = uuidv4();
  //cache or reload not being used anymore, just purge - proxy -> purge
  params.Entries.push(
    {
      Id: `${tempId}`,
      MessageBody: `{"key": "${key}", "endpoint": "${endpoint}"}`,
      MessageGroupId: `${tempId}`
    }
  );

  return params;
}

exports.buildMessage = buildMessage;