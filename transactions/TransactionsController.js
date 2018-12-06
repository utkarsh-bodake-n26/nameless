'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
  TableName: process.env.balanceTableName,
};

module.exports.create = (event, context, callback) => {
  console.log('Received request for all transactions',event);
  const requestBody = JSON.parse(event.body);
  console.log("request body", requestBody);
  console.log("query result", requestBody.queryResult);
  const params = requestBody.queryResult.parameters;
  const intent = requestBody.queryResult.intent.displayName;
  console.log("intent", intent);
    const dbParams = {
        TableName: process.env.balanceTableName,
        Item: {
            userId: requestBody.originalDetectIntentRequest.payload.user.userId,
            spaceName: params.destination_space,
            amount: params["unit-currency"].amount
        },
    };

    dynamoDb.put(dbParams, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: { 'Content-Type': 'text/plain' },
                body: 'Couldn\'t create the todo item.',
            });
            return;
        }

     const response = {
      statusCode: 200,
      body: JSON.stringify({
          "fulfillmentText": "This is a text response",
          "fulfillmentMessages": [
              {
                  "card": {
                      "title": "card title",
                      "subtitle": "card text",
                      "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                      "buttons": [
                          {
                              "text": "button text",
                              "postback": "https://assistant.google.com/"
                          }
                      ]
                  }
              }
          ],
          "source": "example.com",
          "payload": {
              "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                      "items": [
                          {
                              "simpleResponse": {
                                  "textToSpeech": "this is a simple response"
                              }
                          }
                      ]
                  }
              }
          },
          "outputContexts": [
          ],
          "followupEventInput": {
          }
      }),
    };
    callback(null, response);
  });
};
