const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')

const router = express.Router()

const {
  handleError,
  send
} = require('../util')

let JogLog, findAll, started

function startup() {
  JogLog = mongoose.models.JogLog
  findAll = resolvable(JogLog.find.bind(JogLog))
  started = true
}

function getStatistics(user) {
  if (!started) startup()
  return Promise.resolve(user)
    .then(user => findAll({
      $query: {
        user
      },
      $orderby: {
        date: 1
      }
    }))
}

function getWeek(date) {
  var janFirst = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - janFirst) / 86400000) + janFirst.getDay()) / 7);
}

function toMinutes(time) {
  if (time == undefined || !(time instanceof Array) || time.length !== 2) return 0
  return time[0] * 60 + time[1]
}

function toTime(minutes) {
  return [Math.floor(minutes / 60), minutes % 60]
}

function measure(statistics, id, value, entry) {
  const type = `${id}.${value}`
  const s = (statistics[type] = statistics[type] || {})
  s.type = id
  s.value = value
  if (s.slowest == undefined || s.slowest > entry.averageSpeed) s.slowest = entry.averageSpeed
  if (s.fastest == undefined || s.fastest < entry.averageSpeed) s.fastest = entry.averageSpeed
  if (s.shortestDistance == undefined || s.shortestDistance > entry.distance) s.shortestDistance = entry.distance
  if (s.longestDistance == undefined || s.longestDistance < entry.distance) s.longestDistance = entry.distance
  s.distance = (s.distance == undefined ? 0 : s.distance) + entry.distance
  s.time = toTime((toMinutes(s.time) || 0) + toMinutes(entry.time))
  // if (id === 'year' || id === 'overall') {
  //   CONSOLE.LOG(TYPE, S.TIME, TOMINUTES(ENTRY.TIME))
  // }
}

router.get('/statistics', function(request, response) {
  getStatistics(request.user.userId).then(data => {
    const statistics = {}
    let fastest, slowest, month, year, week
    data.forEach((entry, index) => {
      const date = new Date(entry.date)

      year = date.getFullYear()
      month = date.getMonth()
      week = getWeek(date)

      measure(statistics, 'year', year, entry)
      measure(statistics, 'month', month, entry)
      measure(statistics, 'week', week, entry)
      measure(statistics, 'overall', 'overall', entry)
    })

    const output = Object.keys(statistics).reduce((a, i) => {
      if (/^year/.test(i))(a.yearly = a.yearly || []).push(statistics[i])
      if (/^month/.test(i))(a.monthly = a.monthly || []).push(statistics[i])
      if (/^week/.test(i))(a.weekly = a.weekly || []).push(statistics[i])
      if (/^overall/.test(i))(a.overall = a.overall || []).push(statistics[i])
      return a
    }, {})

    send(response, output)
  })

})

module.exports = router