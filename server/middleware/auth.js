const { supabase } = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({ error: 'Not authorized, token failed' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ error: 'Not authorized, no token' });
  }
};

const adminOnly = async (req, res, next) => {
    // Check if user has admin role in Supabase profiles or metadata
    // For now, simple check assuming user is authenticated
    if (req.user) {
        // You would typically check req.user.app_metadata.role or a profiles table
        next();
    } else {
        res.status(403).json({ error: 'Admin access required' });
    }
};

module.exports = { protect, adminOnly };
