import { GetParameterCommand, PutParameterCommand, SSMClient } from '@aws-sdk/client-ssm'

const client = new SSMClient()

const parameterName = name => `/cedar-groves/${name}`

export const getSecret = async name => {
  try {
    const { Parameter } = await client.send(new GetParameterCommand({ Name: parameterName(name), WithDecryption: true }))
    return Parameter.Value
  } catch (err) {
    if (err.name === 'ParameterNotFound') {
      return null
    }
    throw err
  }
}

export const putSecret = async (name, value) => {
  await client.send(new PutParameterCommand({
    Name: parameterName(name),
    Value: value,
    Type: 'SecureString',
    Overwrite: true
  }))
}
