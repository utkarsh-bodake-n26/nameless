'use strict';

const transactionsService = require("./TransactionsService");
const ruleService = require("./RuleService");

module.exports.handleIntent = (event, context) => {
    console.log('Received request for all transactions', JSON.parse(event.body));
    const requestBody = JSON.parse(event.body);
    const params = requestBody.queryResult.parameters;
    const intent = requestBody.queryResult.intent.displayName;

    if (intent.includes("set_rule")) {
        const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        const fromSpace = params.source_space;
        const toSpace = params.destination_space;
        const percentage = params.percentage;
        const txnTag = params.txnTag;

        return ruleService.createRule(userId, fromSpace, toSpace, percentage, txnTag);
    } else {
        const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        const fromSpace = params.source_space;
        const toSpace = params.destination_space;
        const amountToTransfer = params["unit-currency"].amount;

        return transactionsService.transferMoney(userId, fromSpace, toSpace, amountToTransfer);
    }
};
