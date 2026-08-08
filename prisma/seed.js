import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  // 🧹 Clean DB (order matters because of FK)
  await prisma.productImage.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.size.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // =========================
  // 📂 CATEGORIES
  // =========================
  const burgers = await prisma.category.create({
    data: { name: "Burgers" },
  });

  const pizza = await prisma.category.create({
    data: { name: "Pizza" },
  });

  const drinks = await prisma.category.create({
    data: { name: "Drinks" },
  });

  // =========================
  // 🍔 PRODUCTS
  // =========================
  const zinger = await prisma.product.create({
    data: {
      name: "Zinger Burger",
      description: "Crispy chicken burger",
      price: 8.99,
      categoryId: burgers.id,
    },
  });

  const beef = await prisma.product.create({
    data: {
      name: "Beef Burger",
      description: "Juicy beef burger",
      price: 9.99,
      categoryId: burgers.id,
    },
  });

  const margherita = await prisma.product.create({
    data: {
      name: "Margherita Pizza",
      description: "Classic cheese pizza",
      price: 12.5,
      categoryId: pizza.id,
    },
  });

  const pepperoni = await prisma.product.create({
    data: {
      name: "Pepperoni Pizza",
      description: "Pepperoni loaded pizza",
      price: 14,
      categoryId: pizza.id,
    },
  });

  const coke = await prisma.product.create({
    data: {
      name: "Coke",
      description: "Chilled soft drink",
      price: 2.5,
      categoryId: drinks.id,
    },
  });

  // =========================
  // 📏 SIZES
  // =========================
  await prisma.size.createMany({
    data: [
      { name: "Regular", price: 0, productId: zinger.id },
      { name: "Large", price: 2, productId: zinger.id },

      { name: "Regular", price: 0, productId: beef.id },
      { name: "Large", price: 2.5, productId: beef.id },

      { name: "Small", price: 0, productId: margherita.id },
      { name: "Medium", price: 3, productId: margherita.id },
      { name: "Large", price: 5, productId: margherita.id },

      { name: "Small", price: 0, productId: pepperoni.id },
      { name: "Medium", price: 3, productId: pepperoni.id },
      { name: "Large", price: 5, productId: pepperoni.id },
    ],
  });

  // =========================
  // ➕ ADDONS
  // =========================
  await prisma.addon.createMany({
    data: [
      { name: "Extra Cheese", price: 1.5, productId: zinger.id },
      { name: "Mayo Sauce", price: 0.5, productId: zinger.id },
      { name: "Fries", price: 2.0, productId: zinger.id },

      { name: "Cheddar Cheese", price: 1.5, productId: beef.id },
      { name: "BBQ Sauce", price: 0.7, productId: beef.id },

      { name: "Extra Cheese", price: 2.0, productId: margherita.id },
      { name: "Olives", price: 1.2, productId: margherita.id },

      { name: "Mushrooms", price: 1.5, productId: pepperoni.id },
    ],
  });

  // =========================
  // 🖼 IMAGES
  // =========================
  await prisma.productImage.createMany({
    data: [
      { url: "https://via.placeholder.com/300?text=Zinger", productId: zinger.id },
      { url: "https://via.placeholder.com/300?text=Beef", productId: beef.id },
      { url: "https://via.placeholder.com/300?text=Pizza", productId: margherita.id },
      { url: "https://via.placeholder.com/300?text=Pepperoni", productId: pepperoni.id },
      { url: "https://via.placeholder.com/300?text=Coke", productId: coke.id },
    ],
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });