'use strict';

const localstack = require('../settings/localstack');
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'eu-central-1',
    sqs: '2012-11-05'
});

const localstackOptions = {
    endpoint: localstack.settings.endpoints.SQS
};

const isOffline = function() {
    // Depends on serverless-offline plugion which adds IS_OFFLINE to process.env when running offline
    return process.env.IS_OFFLINE;
};

const sqsClient = isOffline() ? new AWS.SQS(localstackOptions) : new AWS.SQS();

const baseQueueUrl = isOffline()
    ? 'http://localhost:4576/123456789012/'
    : 'https://sqs.eu-central-1.amazonaws.com/323151569707/';

const createQueueUrl = queueName => `${baseQueueUrl}${queueName}`;

exports.writeMessage = (message, queueName) => {
    console.log("sending --- ");
    const params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: createQueueUrl(queueName)
    };
    return sqsClient.sendMessage(params).promise();
};
