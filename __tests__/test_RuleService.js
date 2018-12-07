'use strict';

const ruleService = require("./../transactions/RuleService");
const ruleRepository = require("./../transactions/RuleRepository");
const utils = require("./../transactions/Utils");

jest.mock('./../transactions/RuleRepository');
jest.mock('./../transactions/Utils');

describe("RuleService", () => {

    it("should add source_space as main if not present", () => {
        return ruleService.createRule("userId", undefined, "to", "100%", "salary")
            .then(() => {
                expect(ruleRepository.createRule).toBeCalledWith("userId", "main", "to", 100, "salary")
            });
    });

    it("should add source_space as main if empty", () => {
        return ruleService.createRule("userId", "", "to", "100%", "salary")
            .then(() => {
                expect(ruleRepository.createRule).toBeCalledWith("userId", "main", "to", 100, "salary")
            });
    });

    it("should parse percentage param", () => {
        return ruleService.createRule("userId", "main", "to", "10%", "salary")
            .then(() => {
                expect(ruleRepository.createRule).toBeCalledWith("userId", "main", "to", 10, "salary")
            });
    });
});
