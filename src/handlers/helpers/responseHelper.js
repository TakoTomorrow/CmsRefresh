async function buildResponse(results) {
  let response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json",
      connection: "keep-alive",
    },
    statusCode: 200,
    multiValueHeaders: {},
    isBase64Encoded: false,
    body: "",
  };
  try {
    if (results) {
      response.body = JSON.stringify(results);
      return response;
    } else {
      response = await buildErrorResponse(results);
      return response;
    }
  } catch (buildError) {
    console.log("error:", buildError);
  }
}
  
async function buildErrorResponse(lambdaError) {
  let response = {
      headers: {
      "Access-Control-Allow-Origin": "*",
      "content-type": "application/json; charset=UTF-8",
      connection: "keep-alive",
      },
      statusCode: 500,
      multiValueHeaders: {},
      isBase64Encoded: false,
      body: "",
  };
  try {
      response.body = JSON.stringify(lambdaError);
      console.log("response:", JSON.stringify(response));
      return response;
  } catch (errError) {
      console.log("error:", errError);
  }
}

exports.buildResponse = buildResponse;