'use strict';

const ruleRepository = require("./RuleRepository");

const createRule = async (userId, params) => {
    if (!params.hasOwnProperty('source_space') || params.source_space === "") {
        params['source_space'] = "main"
    }

    params.percentage = parseInt(params.percentage.replace('%', '').trim());

    return ruleRepository.createRule(userId, params)
};

module.exports = {
    createRule
};
