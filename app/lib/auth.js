import bcrypt from 'bcrypt'
import { getCmsUser } from './db.js'

const dummyHash = bcrypt.hashSync('', 10)

export const authenticate = async (username, password) => {
  const user = await getCmsUser()
  const storedHash =
    typeof username === 'string' && username === user?.username ? user.passwordHash : undefined
  const passwordMatches = await bcrypt.compare(
    typeof password === 'string' ? password : '',
    storedHash ?? dummyHash
  )
  return Boolean(storedHash) && passwordMatches
}
