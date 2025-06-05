const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");

const auth = (req, res, next) => {
  // Get authorization from header
  const { authorization } = req.headers;

  // Check if authorization header exists
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  // Get token from authorization header
  const token = authorization.replace("Bearer ", "");

  try {
    // Verify token
    const payload = jwt.verify(token, JWT_SECRET);

    // Add payload to request object
    req.user = payload;

    // Move to next middleware
    return next();
  } catch (err) {
    // Handle token verification errors
    return next(new UnauthorizedError("Invalid token"));
  }
};

module.exports = auth;
