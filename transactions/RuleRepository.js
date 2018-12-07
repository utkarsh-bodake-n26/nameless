'use strict';

const dynamoDb = require('../config/db');


const createRule = (userId, source_space, toSpace, percentage, txnTag) => {

    const saveParams = {
        TableName: process.env.rulesTableName,
        Item: {
            userId: userId,
            txnTag: txnTag,
            percentage: percentage,
            source_space: source_space,
            destination_space: toSpace
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
