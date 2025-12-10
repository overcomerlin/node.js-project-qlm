import createError from "http-errors";

export function isAuthenticated(req, res, next) {
  if (req.session?.userId) {
    return next();
  }
  next(createError(401, "Unauthorized. Please log in."));
}
