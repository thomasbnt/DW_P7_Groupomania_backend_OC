class Responses {
  success(message, res) {
    return res.status(200).json({
      success: message || "Success",
    })
  }

  created(message, res) {
    return res.status(201).json({
      success: message || "Created",
    })
  }

  badRequest(message, res) {
    return res.status(400).json({
      error: message || "Error",
    })
  }

  invalidCredentials(message, res) {
    return res.status(401).json({
      error: message || "Invalid credentials",
    })
  }

  forbidden(message, res) {
    return res.status(403).json({
      error: message || "Forbidden",
    })
  }

  notFound(msg, res) {
    return res.status(404).json({
      error: msg,
    })
  }

  conflict(message, res) {
    return res.status(409).json({
      error: message || "Conflict!",
    })
  }

  internalError(message, res) {
    return res.status(500).json({
      error: message || "Internal error",
    })
  }
}

module.exports = new Responses()
