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
      default: Date.now,
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
    field: 'user'
  },

  configure: function() {

    // calculate averageSpeed
    this.modelSchema.pre('save', function(next) {
      let minutes = this.time == undefined || !(this.time instanceof Array) || this.time.length != 2 ? 0 : (this.time[0] * 60 + this.time[1])
      this.averageSpeed = minutes === 0 ? 0 : parseFloat(parseFloat(`${this.distance / minutes * 60}`).toFixed(2))
      next()
    })
  }

}