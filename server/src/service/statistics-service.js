const _ = require('lodash')
const moment = require('moment')
const express = require('express')
const mongoose = require('mongoose')
const resolvable = require('resolvable')
const jogLogModel = require('../model/jog-log')

const router = express.Router()

const {
  send
} = require('../util')

let JogLog, findAll, started

function startup() {
  JogLog = mongoose.models.JogLog
  findAll = resolvable(JogLog.find.bind(JogLog))
  started = true
}

function getJogLog(user) {
  if (!started) startup()
  return Promise.resolve(user)
    .then(() => findAll({
      $query: {
        user
      },
      $orderby: {
        date: 1
      }
    }))
}

function getWeek(date) {
  return moment(date).week()
}

function toMinutes(time) {
  if (time == null || !(time instanceof Array) || time.length !== 2) return 0
  return time[0] * 60 + time[1]
}

function toTime(minutes) {
  return [Math.floor(minutes / 60), Math.round(minutes % 60)]
}

function measure(statistics, id, value, entry, data) {
  const type = `${id}.${value}`
  statistics[type] = Object.assign({}, statistics[type], data)
  const s = statistics[type]
  s.type = id
  if (s.slowestSpeed == null || s.slowestSpeed > entry.averageSpeed) s.slowestSpeed = entry.averageSpeed
  if (s.fastestSpeed == null || s.fastestSpeed < entry.averageSpeed) s.fastestSpeed = entry.averageSpeed
  if (s.shortestDistance == null || s.shortestDistance > entry.distance) s.shortestDistance = entry.distance
  if (s.longestDistance == null || s.longestDistance < entry.distance) {
    s.longestDistance = entry.distance
    s.longestDistDate = entry.date
  }

  if (id === 'week') {
    s.startOfWeek = moment(entry.date).startOf('week')
    s.endOfWeek = moment(entry.date).endOf('week')
  }

  s.date = entry.date

  s.distance = (s.distance == null ? 0 : s.distance) + entry.distance
  s.speed = (s.speed == null ? 0 : s.speed) + entry.averageSpeed
  s.time = toTime((toMinutes(s.time) || 0) + toMinutes(entry.time))
  s.entries = (s.entries || 0) + 1
}

function measureAverage(statistics, id, value) {
  const type = `${id}.${value}`
  const s = statistics[type]
  if (s == null) return
  s.averageDistance = s.distance / s.entries
  s.averageTime = toTime(toMinutes(s.time) / s.entries)
  s.averageSpeed = s.speed / s.entries
}

router.get('/statistics', function(request, response) {

  let userId = request.user.userId
  if (jogLogModel.userSpace.ignore != null && (_.intersection(jogLogModel.userSpace.ignore || [], request.user.roles || []).length !== 0))
    userId = request.body[jogLogModel.userSpace.field] || request.query[jogLogModel.userSpace.field]

  getJogLog(userId).then((data) => {
    const statistics = {}
    let month, year, week
    data.forEach(entry => {
      const date = new Date(entry.date)

      if (year != null && year !== date.getFullYear())
        measureAverage(statistics, 'year', year, {
          year
        })

      if (month != null && month !== date.getMonth())
        measureAverage(statistics, 'month', month, {
          year,
          month
        })

      if (week != null && week !== getWeek(date))
        measureAverage(statistics, 'week', week, {
          year,
          month,
          week
        })

      year = date.getFullYear()
      month = date.getMonth()
      week = getWeek(date)

      measure(statistics, 'overall', 'overall', entry)
      measure(statistics, 'year', year, entry, {
        year
      })
      measure(statistics, 'month', month, entry, {
        year,
        month
      })
      measure(statistics, 'week', week, entry, {
        year,
        month,
        week
      })
    })

    measureAverage(statistics, 'overall', 'overall')
    measureAverage(statistics, 'year', year, {
      year
    })
    measureAverage(statistics, 'month', month, {
      year,
      month
    })
    measureAverage(statistics, 'week', week, {
      year,
      month,
      week
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