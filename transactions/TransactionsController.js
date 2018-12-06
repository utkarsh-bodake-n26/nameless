'use strict';

const transactionRepository = require("./TransactionsRepository");
const dynamoDb = require('../config/db');

module.exports.abcd = async (event, context) => {

    const response = {
        statusCode: 200,
        body: JSON.stringify({message: 'hello world'})
    }

    return response
}

const successResponse = {
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
        "outputContexts": [],
        "followupEventInput": {}
    }),
};

module.exports.create = async (event, context) => {
    console.log('Received request for all transactions', event);
    const requestBody = JSON.parse(event.body);
    console.log("request body", requestBody);
    console.log("query result", requestBody.queryResult);
    const params = requestBody.queryResult.parameters;
    const intent = requestBody.queryResult.intent.displayName;
    console.log("intent", intent);

    const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
    const fromSpace = params.source_space;
    const toSpace = params.destination_space;
    const amount = params["unit-currency"].amount;

    const bulkUpdateParams = {
        RequestItems: {
            [process.env.balanceTableName]: [
                {
                    PutRequest: {
                        Item: {
                            userId: userId,
                            spaceName: fromSpace,
                            amount: amount
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            userId: userId,
                            spaceName: toSpace,
                            amount: amount
                        }
                    }
                }
            ]
        }
    };

    try {
        await transactionRepository.batchCreateTransaction(bulkUpdateParams);
        return successResponse;
    } catch (error) {
        return {
            statusCode: error.statusCode || 501,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create the todo item.',
        }
    }
};
