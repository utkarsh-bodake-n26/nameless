'use strict';

const dynamoDb = require('../config/db');
const sqs = require('../config/sqs');

const getBalances = (userId) => {
    const sourceSpaceParam = {
        TableName: process.env.balanceTableName,
        Key: {
            userId: userId
        }
    };

    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().get(sourceSpaceParam, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

const getBalance = (userId, space) => {

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

const createTxn = (userId, space, txnTag, amount) => {
    const table = {TableName: process.env.balanceTableName};
    const params = {
        Item: {
            userId: userId,
            spaceName: space,
            txnTag: txnTag,
            amount: amount
        }
    };
    const dbParams = Object.assign({}, params, table);
    console.log(JSON.stringify(dbParams));
    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().put(dbParams, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

const sendToQueue = (userId, space, txnTag, amount) => {
    const queueName = process.env.transactionQueueName;
    const message = {
        userId, space, txnTag, amount
    };
    console.log("sending message to queue: " + JSON.stringify(message) + " " + queueName);''
    return sqs
        .writeMessage(message, queueName)
        .then(data => {
            console.log('successfully sent to queue', data);
        })
        .catch(err => {
            console.log('error occurred while sending to queue', err);
        });
};

module.exports = {
    getBalances,
    getBalance,
    batchCreateTransaction,
    createTxn,
    sendToQueue
};
