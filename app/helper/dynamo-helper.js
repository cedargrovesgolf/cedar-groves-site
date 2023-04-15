const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const util = require('util');

const dynamodb = new DynamoDB({ region: process.env.AWS_REGION });
const dynamoQuery = util.promisify(dynamodb.getItem).bind(dynamodb);
const dynamoPut = util.promisify(dynamodb.putItem).bind(dynamodb);


async function getItem(params) {
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
    return null;
  }
};

async function putItem(params) {
  const data = {
    TableName: params.tableName,
    Item: {
      [params.keyName]: { [params.keyType]: params.keyValue }
    }
  };

  try {
    await dynamoPut(data);
  } catch (err) {
    console.log(`[DynamoDB Error]: ${err}`);
    return null;
  }
}

module.exports = {
  getItem,
  putItem
};






