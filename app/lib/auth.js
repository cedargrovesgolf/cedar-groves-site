const bcrypt = require('bcrypt')
const { getCmsUser } = require('./db')

const dummyHash = bcrypt.hashSync('', 10)

const authenticate = async (username, password) => {
  const user = await getCmsUser()
  const storedHash =
    typeof username === 'string' && username === user?.username ? user.passwordHash : undefined
  const passwordMatches = await bcrypt.compare(
    typeof password === 'string' ? password : '',
    storedHash ?? dummyHash
  )
  return Boolean(storedHash) && passwordMatches
}

module.exports = { authenticate }
