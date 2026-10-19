import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();

async function fetchMenuData() {
  const jsonPath = path.join(__dirname, 'scraped_menu.json');
  if (fs.existsSync(jsonPath)) {
    console.log("📄 Loading menu from scraped_menu.json...");
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(raw);
  }

  // Fallback to fetch if JSON file is not present
  try {
    const url = 'https://www.lieferando.de/en/menu/pizzeria-con-amore';
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(html);
    const categories = [];
    $('.menu-category').each((_, catElem) => {
      const catName = $(catElem).find('.category-title').text().trim();
      const products = [];
      $(catElem).find('.menu-item').each((_, itemElem) => {
        const name = $(itemElem).find('.item-name').text().trim();
        const description = $(itemElem).find('.item-description').text().trim();
        const priceText = $(itemElem).find('.price').text().trim();
        const price = parseFloat(priceText.replace(/[€,]/g, ''));
        products.push({ name, description, price, sizes: [], addons: [] });
      });
      categories.push({ name: catName, products });
    });
    return { categories };
  } catch (err) {
    console.warn("⚠️ Direct fetch failed (likely Cloudflare):", err.message);
    throw err;
  }
}

async function main() {
  console.log("🌱 Seeding started...");

  // Fetch Lieferando menu data
  const menuData = await fetchMenuData();

  // 🧹 Clean DB (order matters because of FK)
  await prisma.productImage.deleteMany();
  await prisma.addon.deleteMany();
  await prisma.size.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // =========================
  // 📂 CATEGORIES & PRODUCTS (with Sizes, Addons, Images)
  // =========================
  let orderIdx = 0;
  for (const cat of menuData.categories) {
    await prisma.category.create({
      data: {
        name: cat.name,
        image: cat.image || null,
        order: cat.order ?? orderIdx++,
        products: {
          create: cat.products.map((prod) => ({
            name: prod.name,
            description: prod.description || '',
            price: prod.price,
            sizes: {
              create: (prod.sizes || []).map((sz) => ({
                name: sz.name,
                price: sz.price,
              })),
            },
            addons: {
              create: (prod.addons || []).map((ad) => ({
                name: ad.name,
                price: ad.price,
              })),
            },
            images: {
              create: [
                {
                  url:
                    cat.image ||
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
                },
              ],
            },
          })),
        },
      },
    });
    console.log(`  ✅ Created category "${cat.name}" with ${cat.products.length} products`);
  }

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