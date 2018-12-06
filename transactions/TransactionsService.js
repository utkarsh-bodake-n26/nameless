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
const getResponse = (message) => {
    return {
        statusCode: 200,
        body: getResponseBody(message)
    }
};

const transferMoney = async (userId, fromSpace, toSpace, amountToTransfer) => {

    let fromUpdatedBalance, toUpdatedBalance;

    // from logic
    try {
        const data = await transactionRepository.getBalance(userId, fromSpace);
        const currentBalance = data.Item.amount;

        if (amountToTransfer > currentBalance)
            return getResponse("Insufficient balance in " + fromSpace + " space");

        fromUpdatedBalance = currentBalance - amountToTransfer;
    } catch (error) {
        return getResponse("Error while getting balance in " + fromSpace + " space");
    }

    // to logic
    try {
        const data = await transactionRepository.getBalance(userId, toSpace);
        const currentBalance = data.Item.amount;
        toUpdatedBalance = currentBalance + amountToTransfer;
    } catch (error) {
        return getResponse("Error while getting balance in " + toSpace + " space");
    }

    try {
        await transactionRepository.batchCreateTransaction(userId, fromSpace, toSpace, fromUpdatedBalance, toUpdatedBalance);
        return getResponse("Moved money between spaces");
    } catch (error) {
        return getResponse("Error while moving money from " + fromSpace + " to " + toSpace);
    }
};

const createTxn = async (userId, space, txnTag, amount) => {

    let balanceToUpdate;

    try {
        const data = await transactionRepository.getBalance(userId, space);
        const currentBalance = data.Item.amount;
        balanceToUpdate = currentBalance + amount;
    } catch (error) {
        console.log("Balance does exist for user");
        balanceToUpdate = amount;
    }

    try {
        await transactionRepository.createTxn(userId, space, txnTag, balanceToUpdate);
        await transactionRepository.sendToQueue(userId, space, txnTag, amount);
        return {statusCode: 200, body: JSON.stringify({"message": "success"})};
    } catch (error) {
        return getResponse('Error while inserting transaction.');
    }
};

const getBalances = async (userId) => {
    try {
        const data = await transactionRepository.getBalances(userId);
        const response = JSON.stringify(data);
        console.log(">>>>" + response);
        return {statusCode: 200, body: response};
    } catch (error) {
        return getResponse('Failed to get balances.');
    }
};

module.exports = {
    transferMoney,
    createTxn,
    getBalances
};
