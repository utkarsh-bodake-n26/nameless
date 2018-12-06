'use strict';

const ruleRepository = require("./RuleRepository");

const transactionService = require("./TransactionsService");

/*
* SQS payload: {userId: "id", tags: ["salary"], amount: 100, space: "main"}
* */

module.exports.process = (event, context, callback) => {
    const payload = event.Records[0].body;
    console.log("SQS payload: " + payload);
    const payloadObject = JSON.parse(payload);
    let userId = payloadObject.userId;

    ruleRepository.getRuleForUser(userId)
        .then(result => {
            if(payloadObject.tags.includes(result.Item.txnTag)) {
                const amountToTransfer = (payloadObject.amount * result.Item.percentage) / 100;
                console.log(amountToTransfer);

                return transactionService.transferMoney(
                    userId,
                    result.Item.source_space,
                    result.Item.destination_space,
                    amountToTransfer
                );
            }
        })
        .then(() => console.log("SUCCESS!!!"))
        .catch(() => console.log("FAILED!!!"))
};
