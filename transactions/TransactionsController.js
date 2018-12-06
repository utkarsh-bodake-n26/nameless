'use strict';


const transactionRepository = require("TransactionsRepository");
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
    TableName: process.env.balanceTableName,
};

module.exports.create = (event, context, callback) => {
    console.log('Received request for all transactions', event);
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

    transactionRepository.createTransaction(dbParams)
        .then(() => callback(null, successResponse))
        .catch(() => callback(null, {
            statusCode: error.statusCode || 501,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create the todo item.',
        }));
    const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
    const fromSpace = params.source_space;
    const toSpace = params.destination_space;
    const amount = params["unit-currency"].amount

    var dbParams1 = {
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

    // const dbParams = {
    //     TableName: process.env.balanceTableName,
    //     Item: {
    //         userId: userId,
    //         spaceName: toSpace,
    //         amount: amount
    //     },
    // };

    dynamoDb.batchWrite(dbParams1, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
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
                "outputContexts": [],
                "followupEventInput": {}
            }),
        };
        callback(null, response);
    });
};
