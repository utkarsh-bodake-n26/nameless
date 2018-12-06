'use strict';

const dynamoDb = require('../config/db');

const table = {TableName: process.env.rulesTableName};

const createRule = (userId, params) => {
    const record = Object.assign({}, params, {userId: userId});
    const dbParams = Object.assign({}, {Item: record}, table);

    console.log(dbParams);
    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().put(dbParams, (error, success) => {
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
