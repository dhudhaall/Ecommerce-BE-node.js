// scripts/seedAdmin.js
import prisma from "../src/config/db.js";
import bcrypt from "bcryptjs";

const run = async () => {
  const email = "admin@example.com";
  const rawPassword = "AdminPassword123!";
  const hash = await bcrypt.hash(rawPassword, 10);

  const admin = await prisma.admin.upsert({
    where: { email },
    update: {
      password: hash,
      active: true,
      role: "superadmin"
    },
    create: {
      name: "Super Admin",
      email,
      password: hash,
      role: "superadmin",
      active: true
    }
  });

  console.log("✅ Admin user ready!");
  console.log("Email:", admin.email);
  console.log(" Password:", rawPassword);
};

run()
  .catch((e) => console.error(e))
  .finally(() => process.exit(0));

