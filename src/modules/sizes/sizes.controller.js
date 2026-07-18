import prisma from '../../config/db.js';

// ✅ CREATE SIZE
export const addSize = async (req, res) => {
  try {
    const { name, price, productId } = req.body;

    const size = await prisma.size.create({
      data: {
        name,
        price: parseFloat(price),
        productId: parseInt(productId),
      },
    });

    res.json(size);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create size" });
  }
};

// ✅ GET ALL SIZES
export const getSizes = async (req, res) => {
  try {
    const sizes = await prisma.size.findMany({
      include: {
        product: true, // optional
      },
    });

    res.json(sizes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sizes" });
  }
};

// ✅ GET SIZE BY ID
export const getSizeById = async (req, res) => {
  try {
    const { id } = req.params;

    const size = await prisma.size.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: true,
      },
    });

    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }

    res.json(size);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch size" });
  }
};

// ✅ UPDATE SIZE
export const updateSize = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;

    const size = await prisma.size.update({
      where: { id: parseInt(id) },
      data: {
        name,
        price: price ? parseFloat(price) : undefined,
      },
    });

    res.json(size);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update size" });
  }
};

// ✅ DELETE SIZE
export const deleteSize = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.size.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Size deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete size" });
  }
};