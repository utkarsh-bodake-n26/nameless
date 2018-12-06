'use strict';

const ruleRepository = require("./RuleRepository");

module.exports.createRule = (userId, params) => {
    if (!params.hasOwnProperty('source_space') || params.source_space === "") {
        params['source_space'] = "main"
    }

    params.percentage = parseInt(params.percentage.replace('%', '').trim());

    console.log(params);

    ruleRepository.createRule(userId, params)
};
