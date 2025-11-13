// utilities/error.js
class HttpError extends Error {
  constructor(status, message, description) {
    super(message)
    this.status = status
    this.description = description
  }
}
module.exports = HttpError