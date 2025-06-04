
export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      error: err.name || 'Error',
      message: err.message || 'Something went wrong',
    });
  };
  