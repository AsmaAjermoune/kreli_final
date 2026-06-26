
const ApiError = require('../utils/ApiError')

function errorHandler(err, req, res, next) { 
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'champ'
    return res.status(409).json({ success: false, message: `${field} déjà utilisé` })
  }

  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({ field: e.path, message: e.message }))
    return res.status(400).json({ success: false, message: 'Données invalides', errors })
  }

  
  if (err.name === 'JsonWebTokenError') return res.status(401).json({ success: false, message: 'Token invalide' })
  if (err.name === 'TokenExpiredError')  return res.status(401).json({ success: false, message: 'Token expiré' })

  
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    })
  }

  
  console.error('[UNHANDLED ERROR]', err)
  return res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Erreur serveur' : err.message,
  })
}

module.exports = errorHandler
