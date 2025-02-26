const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);  // Log de errores
    res.status(500).json({ message: "Ha ocurrido un error inesperado" });
  };
  
  module.exports = errorMiddleware;  