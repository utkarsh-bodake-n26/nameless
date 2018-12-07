

const getResponseBody = (message) => {
    return JSON.stringify({
        "fulfillmentText": "This is a text response",
        "fulfillmentMessages": [
            {
                "card": {
                    "title": "card title",
                    "subtitle": "card text",
                    "imageUri": "https://assistant.google.com/static/images/molecule/Molecule-Formation-stop.png",
                    "buttons": [
                        {
                            "text": "button text",
                            "postback": "https://assistant.google.com/"
                        }
                    ]
                }
            }
        ],
        "source": "example.com",
        "payload": {
            "google": {
                "expectUserResponse": true,
                "richResponse": {
                    "items": [
                        {
                            "simpleResponse": {
                                "textToSpeech": message
                            }
                        }
                    ]
                }
            }
        },
        "outputContexts": [],
        "followupEventInput": {}
    })
};
const getIntentResponse = (message) => {
    return {
        statusCode: 200,
        body: getResponseBody(message)
    }
};

const getHttpResponse = (status, body) => {
    return {
        statusCode: status,
        body: JSON.stringify(body)
    }
};

module.exports = {
    getResponseBody,
    getIntentResponse,
    getHttpResponse
};
