const errors = (err, req, res, next) => {
  console.error(err)
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send('Something went wrong. Please try again later.')
}

export default errors
