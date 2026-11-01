/* dynamo-helper.js */
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { cache } = require('./cache');

const dynamodb = new DynamoDB({ region: process.env.AWS_REGION });

async function getItem(params) {
  const cacheKey = `${params.tableName}-${params.keyName}-${params.keyValue}`;

  const cachedItem = cache.get(cacheKey);
  if (cachedItem !== undefined) {
    return cachedItem;
  }

  const query = {
    TableName: params.tableName,
    Key: {
      [params.keyName]: { [params.keyType]: params.keyValue }
    }
  };

  try {
    const data = await dynamodb.getItem(query);
    const result = data.Item;
    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.log(`[DynamoDB Error]: ${err}`);
    return null;
  }
}

async function updateItem(params) {
  const data = {
    TableName: params.tableName,
    Key: {
      [params.keyName]: { [params.keyType]: params.keyValue }
    },
    UpdateExpression: `set #${params.valueName} = :newItem`,
    ExpressionAttributeValues: {
      ':newItem': { [params.valueType]: params.value }
    },
    ExpressionAttributeNames: {
      [`#${params.valueName}`]: params.valueName
    }
  };


  try {
    await dynamodb.updateItem(data);
    const cacheKey = `${params.tableName}-${params.keyName}-${params.keyValue}`;
    cache.del(cacheKey);
  } catch (err) {
    console.log(`[DynamoDB Error]: ${err}`);
    return null;
  }
}

module.exports = {
  getItem,
  updateItem
};
