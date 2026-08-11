// scripts/seedAdmin.js
// Run once to create your first admin:
//   node scripts/seedAdmin.js
//
// Change the values below (or read from env) before running.
// After the first admin exists, you can build an "invite admin"
// route protected by requireRole("superadmin") if you want more.

import prisma from "../src/config/db.js"; // adjust path to your db config
import { createAdmin } from "../src/modules/auth/auth.controller.js"; // adjust path

const run = async () => {
  const email = "farhan@conamorepizzaria.de";
  const password = "qwe123@A"; // change immediately after first login

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    console.log("Admin already exists:", email);
    return;
  }

  const admin = await createAdmin({
    name: "Store Admin",
    email,
    password,
    role: "admin",
  });

  console.log("✅ Admin created:", admin.email);
  console.log("   Log in, then change the password.");
};

run()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));
