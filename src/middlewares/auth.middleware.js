import jwt from "jsonwebtoken";

/**
 * Protects admin routes. Expects: Authorization: Bearer <token>
 * On success, attaches req.admin = { id, email, role } and calls next().
 */
export const requireAdmin = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: "Not authenticated." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    // Covers expired and malformed/invalid tokens
    return res.status(401).json({ error: "Session expired or invalid. Please log in again." });
  }
};

/**
 * Optional: restrict a route to certain roles.
 * Usage: router.delete("/x", requireAdmin, requireRole("superadmin"), handler)
 */
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.admin || !roles.includes(req.admin.role)) {
    return res.status(403).json({ error: "You don't have permission for this action." });
  }
  next();
};