'use strict';

const ruleRepository = require("./RuleRepository");

/*
* SQS payload: {userId, tags, amount}
* */

module.exports.process = (event, context, callback) => {
    const payload = event.Records[0].body;
    console.log("SQS payload: " + payload);
    const payloadObject = JSON.parse(payload);
    console.log("SQS userId: " + payloadObject.userId);

    ruleRepository.getRuleForUser(payloadObject.userId)
        .then(result => {
            if(payloadObject.txnTags.contains(result.txnTag)) {
                const amountToTransfer = (payloadObject.amount * result.percentage) / 100
                console.log(amountToTransfer)




            }
        })
};
