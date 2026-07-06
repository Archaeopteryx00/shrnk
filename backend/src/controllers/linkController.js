const prisma = require('../prisma/client')
const { generateShortCode } = require('../utils/shortCode')

const isValidUrl = (url) => {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch (_) {
    return false
  }
}

const getBaseUrl = (req) => {
  return `${req.protocol}://${req.get('host')}`
}

const getLinks = async (req, res, next) => {
  try {
    const userId = req.user.id
    const links = await prisma.shortLink.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    const baseUrl = getBaseUrl(req)
    const formattedLinks = links.map((link) => ({
      ...link,
      shortUrl: `${baseUrl}/${link.shortCode}`,
    }))

    return res.status(200).json(formattedLinks)
  } catch (err) {
    next(err)
  }
}

const getLinkById = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const linkId = parseInt(id)
    if (isNaN(linkId)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const link = await prisma.shortLink.findUnique({
      where: { id: linkId },
    })

    if (!link) {
      return res.status(404).json({ error: 'Link not found.' })
    }

    if (link.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not own this link.' })
    }

    const baseUrl = getBaseUrl(req)
    const formattedLink = {
      ...link,
      shortUrl: `${baseUrl}/${link.shortCode}`,
    }

    return res.status(200).json(formattedLink)
  } catch (err) {
    next(err)
  }
}

const createLink = async (req, res, next) => {
  try {
    const { originalUrl, title, customCode } = req.body
    const userId = req.user.id

    // 1. Validation
    if (!originalUrl) {
      return res.status(400).json({ error: 'Original URL is required.' })
    }
    if (!isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Must be a valid HTTP or HTTPS URL.' })
    }
    if (title && (typeof title !== 'string' || title.length > 100)) {
      return res.status(400).json({ error: 'Title must be a string and under 100 characters.' })
    }

    let shortCode = ''

    if (customCode) {
      const trimmedCustom = customCode.trim()
      
      // Validate custom code format: alphanumeric, hyphens, underscores
      if (!/^[a-zA-Z0-9-_]+$/.test(trimmedCustom)) {
        return res.status(400).json({ error: 'Custom short code can only contain letters, numbers, hyphens, and underscores.' })
      }
      if (trimmedCustom.length < 3 || trimmedCustom.length > 30) {
        return res.status(400).json({ error: 'Custom short code must be between 3 and 30 characters.' })
      }

      // Check if unique
      const existing = await prisma.shortLink.findUnique({
        where: { shortCode: trimmedCustom }
      })
      if (existing) {
        return res.status(400).json({ error: 'This custom short code is already in use.' })
      }

      shortCode = trimmedCustom
    } else {
      // 2. Generate unique shortCode
      let isUnique = false
      let attempts = 0
      while (!isUnique && attempts < 10) {
        shortCode = generateShortCode()
        const existing = await prisma.shortLink.findUnique({
          where: { shortCode },
        })
        if (!existing) {
          isUnique = true
        }
        attempts++
      }

      if (!isUnique) {
        return res.status(500).json({ error: 'Failed to generate a unique short code. Please try again.' })
      }
    }

    // 3. Create
    const newLink = await prisma.shortLink.create({
      data: {
        originalUrl,
        title: title ? title.trim() : null,
        shortCode,
        userId,
      },
    })

    const baseUrl = getBaseUrl(req)
    return res.status(201).json({
      ...newLink,
      shortUrl: `${baseUrl}/${newLink.shortCode}`,
    })
  } catch (err) {
    next(err)
  }
}

const updateLink = async (req, res, next) => {
  try {
    const { id } = req.params
    const { originalUrl, title } = req.body
    const userId = req.user.id

    const linkId = parseInt(id)
    if (isNaN(linkId)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const link = await prisma.shortLink.findUnique({
      where: { id: linkId },
    })

    if (!link) {
      return res.status(404).json({ error: 'Link not found.' })
    }

    if (link.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not own this link.' })
    }

    // Validate update parameters
    const updateData = {}
    if (originalUrl !== undefined) {
      if (!originalUrl) {
        return res.status(400).json({ error: 'Original URL cannot be empty.' })
      }
      if (!isValidUrl(originalUrl)) {
        return res.status(400).json({ error: 'Must be a valid HTTP or HTTPS URL.' })
      }
      updateData.originalUrl = originalUrl
    }

    if (title !== undefined) {
      if (title !== null && (typeof title !== 'string' || title.length > 100)) {
        return res.status(400).json({ error: 'Title must be under 100 characters.' })
      }
      updateData.title = title ? title.trim() : null
    }

    const updatedLink = await prisma.shortLink.update({
      where: { id: linkId },
      data: updateData,
    })

    const baseUrl = getBaseUrl(req)
    return res.status(200).json({
      ...updatedLink,
      shortUrl: `${baseUrl}/${updatedLink.shortCode}`,
    })
  } catch (err) {
    next(err)
  }
}

const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const linkId = parseInt(id)
    if (isNaN(linkId)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const link = await prisma.shortLink.findUnique({
      where: { id: linkId },
    })

    if (!link) {
      return res.status(404).json({ error: 'Link not found.' })
    }

    if (link.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not own this link.' })
    }

    await prisma.shortLink.delete({
      where: { id: linkId },
    })

    return res.status(200).json({ message: 'Link deleted successfully.' })
  } catch (err) {
    next(err)
  }
}

const getLinkStats = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const linkId = parseInt(id)
    if (isNaN(linkId)) {
      return res.status(400).json({ error: 'Invalid ID format.' })
    }

    const link = await prisma.shortLink.findUnique({
      where: { id: linkId },
    })

    if (!link) {
      return res.status(404).json({ error: 'Link not found.' })
    }

    if (link.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden. You do not own this link.' })
    }

    const lastClick = await prisma.clickHistory.findFirst({
      where: { shortLinkId: linkId },
      orderBy: { clickedAt: 'desc' },
    })

    const baseUrl = getBaseUrl(req)
    return res.status(200).json({
      id: link.id,
      originalUrl: link.originalUrl,
      shortUrl: `${baseUrl}/${link.shortCode}`,
      totalClicks: link.clickCount,
      createdAt: link.createdAt,
      lastClickedAt: lastClick ? lastClick.clickedAt : null,
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  getLinkStats,
}
