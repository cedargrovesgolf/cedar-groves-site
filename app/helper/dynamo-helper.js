const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const util = require('util');

const dynamodb = new DynamoDB({ region: process.env.AWS_REGION });
const dynamoQuery = util.promisify(dynamodb.getItem).bind(dynamodb);

async function getItems(params) {
  const query = {
    TableName: params.tableName,
    Key: {
      [params.keyName]: { [params.keyType]: params.keyValue }
    }
  };

  try {
    const data = await dynamoQuery(query);
    return data.Item;
  } catch (err) {
    console.log(`[DynamoDB Error]: ${err}`);
  }
}

module.exports = getItems;
