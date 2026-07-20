import prisma from '../../config/db.js';

export const getDeliveryZones = async (req, res) => {
  try {
    const zones = await prisma.deliveryZone.findMany({
      where: { active: true },
      select: {
        id: true,
        mainPostalCode: true,
        areaName: true,
        city: true,
        deliveryFee: true,
        minOrder: true,
        coveredPrefixes: true,
      },
      orderBy: { areaName: "asc" },
    });

    // coveredPrefixes is a Json column — make sure it always reaches
    // the frontend as an array, even if a row was saved badly.
    const normalized = zones.map((z) => ({
      ...z,
      coveredPrefixes: Array.isArray(z.coveredPrefixes) ? z.coveredPrefixes : [],
    }));

    return res.json({ zones: normalized });
  } catch (err) {
    console.error("getDeliveryZones error:", err);
    return res.status(500).json({ error: "Could not load delivery areas." });
  }
};

/**
 * POST /delivery-zones
 * Creates a new delivery zone.
 * Body:
 * {
 *   "mainPostalCode": "54810",
 *   "areaName": "Johar Town",
 *   "city": "Lahore",
 *   "deliveryFee": 3.5,          // optional, defaults to 3
 *   "minOrder": 10,              // optional, defaults to 0
 *   "coveredPrefixes": ["5481"], // optional, defaults to [mainPostalCode]
 *   "active": true               // optional, defaults to true
 * }
 * NOTE: protect this route with your admin auth middleware —
 * customers must not be able to create zones.
 */
export const addDeliveryZone = async (req, res) => {
  try {
    const {
      mainPostalCode,
      areaName,
      city,
      deliveryFee = 3,
      minOrder = 0,
      coveredPrefixes,
      active = true,
    } = req.body || {};

    // ---- Validation ----
    if (!mainPostalCode || !/^[A-Za-z0-9 -]{3,10}$/.test(String(mainPostalCode).trim())) {
      return res.status(400).json({ error: "A valid mainPostalCode is required." });
    }
    if (!areaName || !String(areaName).trim()) {
      return res.status(400).json({ error: "areaName is required." });
    }
    if (!city || !String(city).trim()) {
      return res.status(400).json({ error: "city is required." });
    }

    const fee = Number(deliveryFee);
    const min = Number(minOrder);
    if (Number.isNaN(fee) || fee < 0) {
      return res.status(400).json({ error: "deliveryFee must be a number ≥ 0." });
    }
    if (Number.isNaN(min) || min < 0) {
      return res.status(400).json({ error: "minOrder must be a number ≥ 0." });
    }

    // Prefixes: optional array of code-prefixes. Default: the main code itself,
    // so exact matches work even before you add street-level prefixes.
    let prefixes = coveredPrefixes ?? [String(mainPostalCode).trim()];
    if (!Array.isArray(prefixes)) {
      return res.status(400).json({ error: "coveredPrefixes must be an array of strings." });
    }
    prefixes = [...new Set(prefixes.map((p) => String(p).trim()).filter(Boolean))];
    if (prefixes.length === 0 || prefixes.some((p) => !/^[A-Za-z0-9]{3,10}$/.test(p))) {
      return res.status(400).json({
        error: "Each covered prefix must be 3-10 letters/digits (e.g. \"5466\").",
      });
    }

    // Warn about overlap: a new prefix that collides with an existing zone's
    // prefixes would make matching ambiguous.
    const existing = await prisma.deliveryZone.findMany({
      select: { id: true, areaName: true, mainPostalCode: true, coveredPrefixes: true },
    });
    const clash = existing.find((z) => {
      const zp = Array.isArray(z.coveredPrefixes) ? z.coveredPrefixes : [];
      return (
        z.mainPostalCode === String(mainPostalCode).trim() ||
        zp.some((p) => prefixes.some((n) => n.startsWith(p) || p.startsWith(n)))
      );
    });
    if (clash) {
      return res.status(409).json({
        error: `Overlaps with existing zone "${clash.areaName}" (${clash.mainPostalCode}). Adjust the prefixes.`,
      });
    }

    // ---- Create ----
    const zone = await prisma.deliveryZone.create({
      data: {
        mainPostalCode: String(mainPostalCode).trim(),
        areaName: String(areaName).trim(),
        city: String(city).trim(),
        deliveryFee: fee,
        minOrder: min,
        coveredPrefixes: prefixes,
        active: Boolean(active),
      },
    });

    return res.status(201).json({ zone });
  } catch (err) {
    // Prisma unique-constraint violation on mainPostalCode
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "A zone with this mainPostalCode already exists." });
    }
    console.error("addDeliveryZone error:", err);
    return res.status(500).json({ error: "Could not create the delivery zone." });
  }
};