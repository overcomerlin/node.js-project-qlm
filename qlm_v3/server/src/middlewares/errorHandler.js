import config from "../config/index.js";

export default function errorHandler(err, req, res, next) {
  console.error("**** Unhandled error occurred ****", err);

  if (res.headersSent) {
    return next(err);
  }

  // Use the status code provided by http-errors in priority, otherwise use 500
  const statusCode = err.statusCode || 500;
  let message = err.expose ? err.message : "Internal Server Error";

  if (statusCode && err.errors) {
    return res.status(statusCode).json({
      message,
      errors: err.errors,
      stack: !config.isProd ? err.stack : undefined,
    });
  }
  return res.status(statusCode).json({
    message,
    stack: !config.isProd ? err.stack : undefined,
  });
}
