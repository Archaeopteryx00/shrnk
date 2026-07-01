const prisma = require('../prisma/client')
const { hashPassword, verifyPassword } = require('../utils/hash')
const { generateToken } = require('../utils/jwt')

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // 1. Validation
    if (!username || typeof username !== 'string' || username.trim().length < 3 || username.trim().length > 30) {
      return res.status(400).json({ error: 'Username must be between 3 and 30 characters.' })
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Must be a valid email format.' })
    }

    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' })
    }

    // 2. Email uniqueness check
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already registered.' })
    }

    // 3. Create user
    const hashedPassword = await hashPassword(password)
    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      },
    })

    // 4. Return user object (excluding password hash)
    return res.status(201).json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' })
    }

    // 2. Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // 3. Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' })
    }

    // 4. Generate token
    const token = generateToken({ id: user.id, email: user.email })

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  register,
  login,
}
