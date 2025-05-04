import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    console.log('Token extracted:', token);

    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded:', decode);

    if (!decode) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false,
      });
    }

    req.id = decode.userId;
    next();
  } catch (error) {
    console.log('Authentication error:', error);
    return res.status(401).json({
      message: 'Authentication failed',
      success: false,
    });
  }
};

export default isAuthenticated;
