'use strict';

const dynamoDb = require('../config/db');

const createTransaction = (dbParams) => {
    return new Promise((resolve, reject) => {
        dynamoDb.getDoc().put(dbParams, (error, success) => {
            if (error) reject(error);
            else resolve(success)
        });
    });
};

module.exports = {
    createTransaction
};
