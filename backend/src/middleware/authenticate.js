const { verifyToken } = require('../utils/jwt')

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token is missing or malformed.' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    req.user = { id: decoded.id, email: decoded.email }
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Authentication token is invalid or expired.' })
  }
}

module.exports = authenticate
