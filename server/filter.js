let filter = {
  toDate: "2017-07-03T00:00:00.000Z",
  fromDate: {
    '$gt': "2017-07-03T00:00:00.000Z"
  },
  date: {
    '$in': ["2017-07-03T00:00:00.000Z", "2017-07-03T00:00:00.000Z"]
  },
  "$and": [{
    "index": 100
  }, {
    "date": "2017-07-03T00:00:00.000Z"
  }]
}

function isDateColumn(property) {
  return ['fromDate', 'toDate', 'date'].indexOf(property) >= 0
}

function parse(filters, dateCol) {
  if (typeof filters === 'string') {
    return dateCol ? new Date(filters) : filters
  } else if (filters instanceof Array) {
    return filters.map(filter => parse(filter, dateCol))
  } else if (typeof filters === 'object') {
    return Object.keys(filters).reduce((final, property) => {
      final[property] = parse(filters[property], dateCol || isDateColumn(property))
      return final
    }, {})
  }
  return filters
}

let output = parse(filter)
console.log(output)
console.log(output.toDate, filter.toDate instanceof Date, output.toDate instanceof Date)
console.log(output.fromDate.$gt, filter.fromDate.$gt instanceof Date, output.fromDate.$gt instanceof Date)
console.log(output.date.$in[0], filter.date.$in[0] instanceof Date, output.date.$in[0] instanceof Date)
console.log(output.date.$in[1], filter.date.$in[1] instanceof Date, output.date.$in[1] instanceof Date)
console.log(output.$and[1].date, filter.$and[1].date instanceof Date, output.$and[1].date instanceof Date)