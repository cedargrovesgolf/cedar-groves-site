import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import config from '../config.js'

const client = DynamoDBDocumentClient.from(new DynamoDBClient())

const getConfig = async type => {
  const { Item } = await client.send(new GetCommand({ TableName: config.configTable, Key: { type } }))
  return Item
}

const putConfig = async item => {
  await client.send(new PutCommand({ TableName: config.configTable, Item: item }))
}

const getJsonConfig = async type => {
  const item = await getConfig(type)
  return item?.data ? JSON.parse(item.data) : null
}

const putJsonConfig = (type, value) => putConfig({ type, data: JSON.stringify(value) })

export const getHours = async () => {
  const [open, close, override] = await Promise.all(['open', 'close', 'override'].map(getConfig))
  return {
    open: open?.hour ?? null,
    close: close?.hour ?? null,
    override: override?.hour ?? null
  }
}

export const setHours = async ({ open, close, override }) => {
  await Promise.all(
    Object.entries({ open, close, override }).map(([type, hour]) =>
      putConfig({ type, hour: hour || null })
    )
  )
}

export const getRates = () => getJsonConfig('rates')

export const setRates = rates => putJsonConfig('rates', rates)

export const getMemberships = () => getJsonConfig('memberships')

export const setMemberships = memberships => putJsonConfig('memberships', memberships)

export const getSeasonYear = async () => {
  const season = await getJsonConfig('season')
  return season?.year ?? null
}

export const setSeasonYear = year => putJsonConfig('season', { year })

export const getGallery = async () => {
  const item = await getConfig('gallery')
  return { photos: [], ...(item?.data && JSON.parse(item.data)), version: item?.version ?? 0 }
}

export const setGallery = async ({ version, ...gallery }) => {
  await client.send(new PutCommand({
    TableName: config.configTable,
    Item: { type: 'gallery', data: JSON.stringify(gallery), version: version + 1 },
    ConditionExpression: 'attribute_not_exists(#version) OR #version = :version',
    ExpressionAttributeNames: { '#version': 'version' },
    ExpressionAttributeValues: { ':version': version }
  }))
}

export const getCmsUser = async () => {
  const { Item } = await client.send(new GetCommand({ TableName: config.cmsUsersTable, Key: { userID: 0 } }))
  return Item ?? null
}
