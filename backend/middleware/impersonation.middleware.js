export const impersonateUser = (req, res, next) => {
  const { impersonateUserId } = req.headers;

  if (!impersonateUserId) return next();

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Impersonation not allowed" });
  }

  req.impersonatedUserId = impersonateUserId;
  next();
};
