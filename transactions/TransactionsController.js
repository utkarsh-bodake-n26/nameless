'use strict';

const transactionsService = require("./TransactionsService");

module.exports.create = async (event, context) => {
    console.log('Received request for creating transaction', JSON.parse(event.body));
    const requestBody = JSON.parse(event.body);

    const userId = requestBody.userId;
    const space = requestBody.space;
    const txnTag = requestBody.txnTag;
    const amount = requestBody.amount;

    return transactionsService.createTxn(userId, space, txnTag, amount);
};


module.exports.getBalances = async (event, context) => {
    const userId = event.pathParameters.userId;

    return transactionsService.getBalances(userId);
};
