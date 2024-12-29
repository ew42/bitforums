const jwt = require('jsonwebtoken');
const User = require('../controllers/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: "Authorization required"});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      throw new Error('Invalid token');
    }
    req.user = user;
    next();
  }
  catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
}

module.exports = auth;