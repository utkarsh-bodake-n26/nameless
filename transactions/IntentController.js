'use strict';

const transactionsService = require("./TransactionsService");
const ruleService = require("./RuleService");

module.exports.handleIntent = async (event, context) => {
    console.log('Received request for all transactions', JSON.parse(event.body));
    const requestBody = JSON.parse(event.body);
    const params = requestBody.queryResult.parameters;
    const intent = requestBody.queryResult.intent.displayName;

    if (intent === "set_rule") {
        //TODO: Don't hard code `userId` vs use
        // const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        // Check if this intent get the user id too.
        ruleService.createRule("userId", params);
        // TODO: return response saying DONE
    } else {
        const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        const fromSpace = params.source_space;
        const toSpace = params.destination_space;
        const amountToTransfer = params["unit-currency"].amount;

        return transactionsService.transferMoney(userId, fromSpace, toSpace, amountToTransfer);
    }
};
