const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb')

const { configTable, cmsUsersTable } = require('../config')

const client = DynamoDBDocumentClient.from(new DynamoDBClient())

const getConfig = async type => {
  const { Item } = await client.send(new GetCommand({ TableName: configTable, Key: { type } }))
  return Item
}

const putConfig = async item => {
  await client.send(new PutCommand({ TableName: configTable, Item: item }))
}

const getJsonConfig = async type => {
  const item = await getConfig(type)
  return item?.data ? JSON.parse(item.data) : null
}

const putJsonConfig = (type, value) => putConfig({ type, data: JSON.stringify(value) })

const getHours = async () => {
  const [open, close, override] = await Promise.all(['open', 'close', 'override'].map(getConfig))
  return {
    open: open?.hour ?? null,
    close: close?.hour ?? null,
    override: override?.hour ?? null
  }
}

const setHours = async ({ open, close, override }) => {
  await Promise.all(
    Object.entries({ open, close, override }).map(([type, hour]) =>
      putConfig({ type, hour: hour || null })
    )
  )
}

const getRates = () => getJsonConfig('rates')

const setRates = rates => putJsonConfig('rates', rates)

const getMemberships = () => getJsonConfig('memberships')

const setMemberships = memberships => putJsonConfig('memberships', memberships)

const getSeasonYear = async () => {
  const season = await getJsonConfig('season')
  return season?.year ?? null
}

const setSeasonYear = year => putJsonConfig('season', { year })

const getCmsUser = async () => {
  const { Item } = await client.send(new GetCommand({ TableName: cmsUsersTable, Key: { userID: 0 } }))
  return Item ?? null
}

module.exports = {
  getHours,
  setHours,
  getRates,
  setRates,
  getMemberships,
  setMemberships,
  getSeasonYear,
  setSeasonYear,
  getCmsUser
}
