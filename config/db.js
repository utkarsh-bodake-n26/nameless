'use strict';

const localstack = require('../settings/localstack');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1'
});

const localstackOptions = {
    endpoint: localstack.settings.endpoints.DynamoDB
};

const isOffline = function() {
    // Depends on serverless-offline plugion which adds IS_OFFLINE to process.env when running offline
    return process.env.IS_OFFLINE;
};

const dynamodb = {
    doc: isOffline()
        ? new AWS.DynamoDB.DocumentClient(localstackOptions)
        : new AWS.DynamoDB.DocumentClient(),
    raw: isOffline() ? new AWS.DynamoDB(localstackOptions) : new AWS.DynamoDB()
};

const getDoc = () => dynamodb.doc;

module.exports = {
    getDoc
}
