'use strict';

const ruleService = require("./../transactions/RuleService");
const ruleRepository = require("./../transactions/RuleRepository");

jest.mock('./../transactions/RuleRepository');

describe("RuleService", () => {

    it("should add source_space as main if not present", () => {
        const params = {"percentage": "100%"};
        ruleService.createRule("userId", params);

        expect(ruleRepository.createRule).toBeCalledWith("userId", {"source_space": "main", "percentage": 100});
    });

    it("should add source_space as main if empty", () => {
        const params = {"source_space": "", "percentage": "100%"};
        ruleService.createRule("userId", params);

        expect(ruleRepository.createRule).toBeCalledWith("userId", {"source_space": "main", "percentage": 100});
    });

    it("should parse percentage param", () => {
        const params = {"source_space": "saving", "percentage": "10%"};
        ruleService.createRule("userId", params);

        expect(ruleRepository.createRule).toBeCalledWith("userId", {"source_space": "saving", "percentage": 10});
    });
});
