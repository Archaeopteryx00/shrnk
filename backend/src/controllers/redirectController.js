const prisma = require('../prisma/client')

const redirectUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params

    const link = await prisma.shortLink.findUnique({
      where: { shortCode },
    })

    if (!link) {
      return res.status(404).json({ error: 'Short link not found.' })
    }

    // Increment click count and record click history
    await prisma.$transaction([
      prisma.shortLink.update({
        where: { shortCode },
        data: { clickCount: { increment: 1 } },
      }),
      prisma.clickHistory.create({
        data: { shortLinkId: link.id },
      }),
    ])

    return res.redirect(302, link.originalUrl)
  } catch (err) {
    next(err)
  }
}

module.exports = redirectUrl
