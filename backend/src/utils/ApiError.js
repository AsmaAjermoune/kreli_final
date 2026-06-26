
class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message)
    this.statusCode = statusCode
    this.errors     = errors
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(msg, errors) { return new ApiError(400, msg, errors) }
  static unauthorized(msg = 'Non autorisé')       { return new ApiError(401, msg) }
  static forbidden(msg = 'Accès refusé')           { return new ApiError(403, msg) }
  static notFound(msg = 'Ressource introuvable')   { return new ApiError(404, msg) }
  static conflict(msg)                             { return new ApiError(409, msg) }
  static internal(msg = 'Erreur serveur')          { return new ApiError(500, msg) }
}

module.exports = ApiError
