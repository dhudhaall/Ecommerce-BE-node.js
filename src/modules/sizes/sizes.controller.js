import prisma from "../../config/db.js";

// ✅ CREATE SIZE
export const addSize = async (req, res, next) => {
  try {
    const { name, price, productId } = req.body;

    const size = await prisma.size.create({
      data: {
        name: name?.trim(),
        price: parseFloat(price) || 0,
        productId: parseInt(productId),
      },
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    res.status(201).json(size);
  } catch (err) {
    next(err);
  }
};

// ✅ GET ALL SIZES
export const getSizes = async (req, res, next) => {
  try {
    const where = req.query.productId ? { productId: Number(req.query.productId) } : {};
    const sizes = await prisma.size.findMany({
      where,
      include: {
        product: { select: { id: true, name: true } },
      },
      orderBy: { id: "desc" },
    });

    res.json(sizes);
  } catch (err) {
    next(err);
  }
};

// ✅ GET SIZE BY ID
export const getSizeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const size = await prisma.size.findUnique({
      where: { id: parseInt(id) },
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    if (!size) {
      return res.status(404).json({ error: "Size not found" });
    }

    res.json(size);
  } catch (err) {
    next(err);
  }
};

// ✅ UPDATE SIZE
export const updateSize = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price, productId } = req.body;

    const size = await prisma.size.update({
      where: { id: parseInt(id) },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        price: price !== undefined ? parseFloat(price) : undefined,
        productId: productId !== undefined ? parseInt(productId) : undefined,
      },
      include: {
        product: { select: { id: true, name: true } },
      },
    });

    res.json(size);
  } catch (err) {
    next(err);
  }
};

// ✅ DELETE SIZE
export const deleteSize = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.size.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Size deleted successfully" });
  } catch (err) {
    next(err);
  }
};