
[![Build Status](https://travis-ci.org/utkarsh-bodake-n26/nameless.svg?branch=master)](https://travis-ci.org/utkarsh-bodake-n26/nameless)


## Offline run
docker run -it -e DEFAULT_REGION='ap-southeast-1' -p 4567-4578:4567-4578 -p 8080:8080 atlassianlabs/localstack
aws --region=ap-southeast-1 --endpoint-url=http://localhost:4569 dynamodb create-table --table-name nameless.local.balance  --attribute-definitions AttributeName=userId,AttributeType=S AttributeName=spaceName,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH AttributeName=spaceName,KeyType=RANGE  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5
sls offline start

