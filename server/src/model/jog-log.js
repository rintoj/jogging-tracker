module.exports = {

  name: 'JogLog',
  url: '/joglog',

  schema: {
    id: {
      type: String,
      idField: true
    },
    date: {
      type: String,
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

  userSpace: true

}