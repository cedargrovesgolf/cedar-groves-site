export const reply = (res, status, type, message, extra = {}) =>
  res.status(status).json({ type, message, ...extra })
