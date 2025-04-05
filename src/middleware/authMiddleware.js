export const authMiddleware = (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'No autenticado' });
    next();
  };
  
  export const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Acceso denegado' });
    next();
  };