function handleError(error, response) {
  console.log(error)
  send(response, error, 500)
}

function send(response, data, status) {
  response.status(status || 200)
  response.json(status ? {
    status,
    error: data
  } : data)
}

module.exports = {
  handleError,
  send
}