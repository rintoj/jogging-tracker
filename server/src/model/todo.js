module.exports = {

  // mandatory
  name: 'Todo',

  // api end point (optional)
  url: '/todo',

  // schema definition - supports everything that mongoose schema supports
  schema: {
    index: {
      type: Number, // type of this attribute
      autoIncrement: true, // auto increment this attribute
      idField: true // serves as id attribute replacing _id
    },
    title: {
      type: String,
      required: true
    },
    description: String, // attribute definition can be as simple as this
    status: String,
  }

}