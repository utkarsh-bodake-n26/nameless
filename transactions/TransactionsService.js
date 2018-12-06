'use strict';

const transactionRepository = require("./TransactionsRepository");

const getSuccessResponse = () => {
    return {
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
        })
    }
};

const getErrorResponse = (message) => {
    return {
        statusCode: 500,
        headers: {'Content-Type': 'text/plain'},
        body: JSON.stringify({message})
    };
};

const transferMoney = async (userId, fromSpace, toSpace, amountToTransfer) => {

    let fromUpdatedBalance, toUpdatedBalance;

    // from logic
    try {
        const data = await transactionRepository.getTransaction(userId, fromSpace);
        const currentBalance = data.Item.amount;

        if (amountToTransfer > currentBalance)
            return getErrorResponse('Insufficient balance.');

        fromUpdatedBalance = currentBalance - amountToTransfer;
    } catch (error) {
        return getErrorResponse('Error while getting from transaction.');
    }

    // to logic
    try {
        const data = await transactionRepository.getTransaction(userId, toSpace);
        const currentBalance = data.Item.amount;
        toUpdatedBalance = currentBalance + amountToTransfer;
    } catch (error) {
        return getErrorResponse('Error while getting to transaction.');
    }

    try {
        await transactionRepository.batchCreateTransaction(userId, fromSpace, toSpace, fromUpdatedBalance, toUpdatedBalance);
        return getSuccessResponse();
    } catch (error) {
        return getErrorResponse('Error while bulk inserting transactions.');
    }
};

module.exports = {
    transferMoney
};
