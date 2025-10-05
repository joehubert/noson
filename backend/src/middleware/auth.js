const jwt = require('jsonwebtoken');
const { User } = require('../models');

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { 
          code: 'NO_TOKEN', 
          message: 'Authentication required. Please provide a valid token.' 
        }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'NO_TOKEN', message: 'Authentication required' }
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }
    
    req.user = user;
    req.userId = user.id;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' }
      });
    }
    
    res.status(401).json({
      success: false,
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' }
    });
  }
}

module.exports = authMiddleware;
