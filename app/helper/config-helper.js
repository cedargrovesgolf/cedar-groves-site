/* config-helper.js */
const { getItem } = require('./dynamo-helper');

const baseQuery = {
  tableName: 'cedar-groves-hours',
  keyName: 'type',
  keyType: 'S'
};

function parseConfigItem(result) {
  if (result && result.data && result.data.S) {
    return JSON.parse(result.data.S);
  }
  return null;
}

async function getRates() {
  const result = await getItem({ ...baseQuery, keyValue: 'rates' });
  return parseConfigItem(result);
}

async function getMemberships() {
  const result = await getItem({ ...baseQuery, keyValue: 'memberships' });
  return parseConfigItem(result);
}

async function getSeasonYear() {
  const result = await getItem({ ...baseQuery, keyValue: 'season' });
  const parsed = parseConfigItem(result);
  return parsed ? parsed.year : null;
}

module.exports = {
  getRates,
  getMemberships,
  getSeasonYear
};
