function calculateAvgSpeed(item) {
  const minutes = item.time == null || !(item.time instanceof Array) || item.time.length !== 2 ?
    0 : (item.time[0] * 60 + item.time[1])
  item.averageSpeed = minutes === 0 ? 0 : parseFloat(parseFloat(`${item.distance / minutes * 60}`).toFixed(2))
  return item
}

module.exports = {

  name: 'JogLog',
  url: '/joglog',

  schema: {
    id: {
      type: String,
      idField: true
    },
    date: {
      type: Date,
      required: true
    },
    distance: {
      type: Number,
      required: true
    },
    time: {
      type: [],
      required: true
    },
    averageSpeed: Number
  },

  userSpace: {
    field: 'user',
    ignore: ['admin']
  },

  beforeSave: function(item) {
    const items = item instanceof Array ? item : [item]
    return items.map(calculateAvgSpeed)
  }

}