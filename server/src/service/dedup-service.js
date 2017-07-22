const express = require('express')

const router = express.Router()

router.post('/dedup', (request, response) => {
  const found = {}
  response.json(request.body.filter(data => {
    if (!found[data.date]) {
      found[data.date] = true
      return true
    }
    return false
  }))
})

module.exports = router