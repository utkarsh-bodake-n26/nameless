'use strict';

const transactionsService = require("./TransactionsService");
const ruleService = require("./RuleService");

const utils = require("./Utils");

module.exports.handleIntent = async (event, context) => {
    console.log('Received request for all transactions', JSON.parse(event.body));
    const requestBody = JSON.parse(event.body);
    const params = requestBody.queryResult.parameters;
    const intent = requestBody.queryResult.intent.displayName;

    if (intent === "set_rule") {
        const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        console.log(">>>>>" + userId);
        try {
            await ruleService.createRule("userId", params);
            return utils.getIntentResponse("Moved money between spaces");
        } catch (error) {
            console.log(JSON.stringify(error));
            return utils.getIntentResponse("Error while setting rule");
        }
    } else {
        const userId = requestBody.originalDetectIntentRequest.payload.user.userId;
        const fromSpace = params.source_space;
        const toSpace = params.destination_space;
        const amountToTransfer = params["unit-currency"].amount;

        return transactionsService.transferMoney(userId, fromSpace, toSpace, amountToTransfer);
    }
};
