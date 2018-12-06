'use strict';

const dynamoDb = require('../config/db');

const getTransaction = (userId, space) => {

    const sourceSpaceParam = {
        TableName: process.env.balanceTableName,
        Key: {
            userId: userId,
            spaceName: space
        }
    };

    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().get(sourceSpaceParam, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

const batchCreateTransaction = (userId, fromSpace, toSpace, fromUpdatedBalance, toUpdatedBalance) => {

    const bulkUpdateParams = {
        RequestItems: {
            [process.env.balanceTableName]: [
                {
                    PutRequest: {
                        Item: {
                            userId: userId,
                            spaceName: fromSpace,
                            amount: fromUpdatedBalance
                        }
                    }
                },
                {
                    PutRequest: {
                        Item: {
                            userId: userId,
                            spaceName: toSpace,
                            amount: toUpdatedBalance
                        }
                    }
                }
            ]
        }
    };

    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().batchWrite(bulkUpdateParams, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

module.exports = {
    getTransaction,
    batchCreateTransaction
};
