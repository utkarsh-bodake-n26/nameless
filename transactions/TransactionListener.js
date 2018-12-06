'use strict';

module.exports.process = (event, context, callback) => {
    console.log("SQS message: " + JSON.stringify(event));
    const payload = event.Records[0].body;
    console.log("SQS payload: " + payload);
    const payloadObject = JSON.parse(payload);
    console.log("SQS userId: " + payloadObject.userId);
};
