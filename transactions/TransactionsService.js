'use strict';

const transactionRepository = require("./TransactionsRepository");

const getResponseBody = (message) => {
    return JSON.stringify({
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
                                "textToSpeech": message
                            }
                        }
                    ]
                }
            }
        },
        "outputContexts": [],
        "followupEventInput": {}
    })
};
const getSuccessResponse = () => {
    return {
        statusCode: 200,
        body: getResponseBody("Moved money between spaces.")
    }
};

const transferMoney = async (userId, fromSpace, toSpace, amountToTransfer) => {

    let fromUpdatedBalance, toUpdatedBalance;

    // from logic
    try {
        const data = await transactionRepository.getTransaction(userId, fromSpace);
        const currentBalance = data.Item.amount;

        if (amountToTransfer > currentBalance)
            return getSuccessResponse("Insufficient balance in " + fromSpace + " space");

        fromUpdatedBalance = currentBalance - amountToTransfer;
    } catch (error) {
        return getSuccessResponse("Error while getting balance in " + fromSpace + " space");
    }

    // to logic
    try {
        const data = await transactionRepository.getTransaction(userId, toSpace);
        const currentBalance = data.Item.amount;
        toUpdatedBalance = currentBalance + amountToTransfer;
    } catch (error) {
        return getSuccessResponse("Error while getting balance in " + toSpace + " space");
    }

    try {
        await transactionRepository.batchCreateTransaction(userId, fromSpace, toSpace, fromUpdatedBalance, toUpdatedBalance);
        return getSuccessResponse();
    } catch (error) {
        return getSuccessResponse("Error while moving money from " + fromSpace + " to " + toSpace);
    }
};

const createTxn = async (userId, space, txnTag, amount) => {

    let balanceToUpdate;

    try {
        const data = await transactionRepository.getTransaction(userId, space);
        const currentBalance = data.Item.amount;
        balanceToUpdate = currentBalance + amount;
    } catch (error) {
        return getSuccessResponse('Error while getting from transaction.');
    }

    try {
        await transactionRepository.createTxn(userId, space, txnTag, balanceToUpdate);
        transactionRepository.sendToQueue(userId, space, txnTag, amount);
        return {statusCode: 200, body: JSON.stringify({"message": "success"})};
    } catch (error) {
        return getSuccessResponse('Error while bulk inserting transactions.');
    }
};

module.exports = {
    transferMoney,
    createTxn
};
