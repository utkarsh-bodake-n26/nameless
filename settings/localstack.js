module.exports.settings = {
    host: 'http://localhost',
    kinesis: {
        enabled: true,
        intervalMillis: 5000
    },
    endpoints: {
        APIGateway: 'http://localhost:4567',
        CloudWatch: 'http://localhost:4582',
        SES: 'http://localhost:4579',
        Kinesis: 'http://localhost:4568',
        Redshift: 'http://localhost:4577',
        S3: 'http://localhost:4572',
        CloudFormation: 'http://localhost:4581',
        DynamoDB: 'http://localhost:4569',
        SQS: 'http://localhost:4576',
        Elasticsearch: 'http://localhost:4571',
        SNS: 'http://localhost:4575',
        DynamoDBStreamsService: 'http://localhost:4570',
        FirehoseService: 'http://localhost:4573',
        Route53: 'http://localhost:4580'
    }
};
