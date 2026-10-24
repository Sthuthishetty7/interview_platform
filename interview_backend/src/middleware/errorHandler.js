// Runs when no route matches the address that was requested.
function notFound(req, res) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Runs when any route throws an error. Express needs all four arguments here.
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? "Something went wrong on the server." : err.message,
  });
}

module.exports = { notFound, errorHandler };