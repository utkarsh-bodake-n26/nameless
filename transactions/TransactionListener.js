'use strict';

const ruleRepository = require("./RuleRepository");

const transactionService = require("./TransactionsService");

/*
* SQS payload: {userId: "id", tags: ["salary"], amount: 100, space: "main"}
* */

module.exports.process = (event, context, callback) => {
    const payload = event.Records[0].body;
    console.log("SQS payload: " + payload);
    const transactionPayload = JSON.parse(payload);
    let userId = transactionPayload.userId;

    ruleRepository.getRuleForUser(userId)
        .then(rule => {
            if (transactionPayload.tags.includes(rule.Item.txnTag)) {
                const amountToTransfer = (transactionPayload.amount * rule.Item.percentage) / 100;
                console.log(amountToTransfer);

                return transactionService.transferMoney(
                    userId,
                    rule.Item.source_space,
                    rule.Item.destination_space,
                    amountToTransfer
                );
            }
        })
        .then(() => console.log("Successfully inserted rule for " + userId))
        .catch(() => console.log("Ignored. Not rule found for " + userId))
};
