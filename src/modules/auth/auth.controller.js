import prisma from "../../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================================
   POST /admin/login
   Body: { email, password }
   Returns: { token, admin: { id, name, email, role } }
   ============================================================ */

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const admin = await prisma.admin.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    // Same generic message whether the email is unknown or the password is
    // wrong — never reveal which one failed (prevents email enumeration).
    if (!admin || !admin.active) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    // Sign a JWT — payload holds only non-sensitive identifiers
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("ADMIN LOGIN ERROR:", error);
    return res.status(500).json({ error: "Login failed." });
  }
};

/* ============================================================
   GET /admin/me   (protected — returns the logged-in admin)
   Useful for the frontend to verify a stored token on load.
   ============================================================ */

export const getMe = async (req, res) => {
  try {
    // req.admin is set by the auth middleware
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin.id },
      select: { id: true, name: true, email: true, role: true, active: true },
    });
    if (!admin || !admin.active) {
      return res.status(401).json({ error: "Account not found or disabled." });
    }
    return res.json({ admin });
  } catch (error) {
    console.error("GET ME ERROR:", error);
    return res.status(500).json({ error: "Failed to load profile." });
  }
};

/* ============================================================
   Seed helper — create the FIRST admin.
   Run once from a script (see seedAdmin.js), NOT exposed as a route.
   ============================================================ */

export const createAdmin = async ({ name, email, password, role = "admin" }) => {
  const hash = await bcrypt.hash(password, 10);
  return prisma.admin.create({
    data: {
      name,
      email: email.trim().toLowerCase(),
      password: hash,
      role,
    },
  });
};