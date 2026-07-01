const express = require('express')
const router = express.Router()
const {
  getLinks,
  getLinkById,
  createLink,
  updateLink,
  deleteLink,
  getLinkStats,
} = require('../controllers/linkController')
const authenticate = require('../middleware/authenticate')

router.get('/', authenticate, getLinks)
router.get('/:id', authenticate, getLinkById)
router.post('/', authenticate, createLink)
router.put('/:id', authenticate, updateLink)
router.delete('/:id', authenticate, deleteLink)
router.get('/:id/stats', authenticate, getLinkStats)

module.exports = router
