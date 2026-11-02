const safeMethods = new Set(['GET', 'HEAD'])
const allowedSites = new Set(['same-origin', 'none'])

const csrf = (req, res, next) => {
  const fetchSite = req.get('Sec-Fetch-Site')
  if (!safeMethods.has(req.method) && fetchSite && !allowedSites.has(fetchSite)) {
    return res.sendStatus(403)
  }
  next()
}

module.exports = csrf
