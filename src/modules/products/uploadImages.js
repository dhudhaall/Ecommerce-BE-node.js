// routes/product.js
import express from "express";
import { upload } from "../utils/multer.js";
import { prisma } from "../config/prisma.js";

const router = express.Router();

router.post("/create", upload.array("images", 5), async (req, res) => {
  try {
    const { name, price, categoryId } = req.body;

    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`
    }));

    

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        categoryId: Number(categoryId),
        images: {
          create: imageUrls
        }
      },
      include: {
        images: true
      }
    });

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;