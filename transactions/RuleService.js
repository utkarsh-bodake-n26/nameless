'use strict';

const ruleRepository = require("./RuleRepository");

const utils = require("./Utils");

const createRule = async (userId, fromSpace, toSpace, percentage, txnTag) => {
    let source_space = fromSpace;
    if (!fromSpace || fromSpace === "") {
        source_space = "main"
    }

    percentage = parseInt(percentage.replace('%', '').trim());

    try {
        await ruleRepository.createRule(userId, source_space, toSpace, percentage, txnTag);
        return utils.getIntentResponse("Rule created successfully");
    } catch (error) {
        console.log(JSON.stringify(error));
        return utils.getIntentResponse("Error while setting rule");
    }
};

module.exports = {
    createRule
};
