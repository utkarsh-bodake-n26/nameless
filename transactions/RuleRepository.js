'use strict';

const dynamoDb = require('../config/db');

const table = {TableName: process.env.rulesTableName};

const createRule = (userId, params) => {

    const saveParams = {
        TableName: process.env.rulesTableName,
        Item: {
            userId: userId,
            txnTag: params.txnTag,
            percentage: params.percentage,
            source_space: params.source_space,
            destination_space: params.destination_space
        }
    };
    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().put(saveParams, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

const getRuleForUser = (userId) => {
    console.log(userId);
    const params = {
        TableName: process.env.rulesTableName,
        Key: {
            userId: userId
        }
    };

    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().get(params, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

module.exports = {
    createRule,
    getRuleForUser
};
