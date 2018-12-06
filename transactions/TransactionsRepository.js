
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
    TableName: process.env.balanceTableName,
};

const createTransaction = async (dbParams) => {
    dynamoDb.put(dbParams, (error, success) => {
        let promise = await new Promise((resolve, reject) => {
            if(error) reject(error);
            else resolve(success)
        });
        return promise;
    });
}

module.exports = {
    createTransaction
};
