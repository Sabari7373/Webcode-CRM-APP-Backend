const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY || 'yourSecretKey';

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = authenticateToken;