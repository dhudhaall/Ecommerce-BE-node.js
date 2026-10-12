import prisma from '../../config/db.js';
import axios from 'axios';

const RESTAURANT_LAT = parseFloat(process.env.RESTAURANT_LAT) || 48.8566;
const RESTAURANT_LNG = parseFloat(process.env.RESTAURANT_LNG) || 2.3522;

export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function geocodePostalCode(postalCode, city = '') {
  try {
    const query = [postalCode, city].filter(Boolean).join(' ');
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'EcommerceApp/1.0 (contact@ecommerce.com)',
      },
      timeout: 5000,
    });

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return null;
  } catch (err) {
    console.error("Geocoding error:", err.message);
    return null;
  }
}

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
    if (err?.code === "P2002") {
      return res.status(409).json({ error: "A zone with this mainPostalCode already exists." });
    }
    console.error("addDeliveryZone error:", err);
    return res.status(500).json({ error: "Could not create the delivery zone." });
  }
};

export const calculateDeliveryFee = async (req, res) => {
  try {
    const { postalCode, city, address } = req.body || {};

    if (!postalCode || !String(postalCode).trim()) {
      return res.status(400).json({
        deliverable: false,
        deliveryFee: 0,
        message: "Postal code is required.",
      });
    }

    const cleanPostalCode = String(postalCode).trim();
    const cleanCity = city ? String(city).trim() : '';

    // Check if database has an explicit matching active zone
    const activeZones = await prisma.deliveryZone.findMany({ where: { active: true } });
    const matchingZone = activeZones.find((z) => {
      const prefixes = Array.isArray(z.coveredPrefixes) ? z.coveredPrefixes : [];
      return (
        z.mainPostalCode === cleanPostalCode ||
        prefixes.some((p) => cleanPostalCode.startsWith(p) || p.startsWith(cleanPostalCode))
      );
    });

    if (matchingZone) {
      return res.json({
        deliverable: true,
        distanceKm: 0,
        deliveryFee: matchingZone.deliveryFee,
        minOrder: matchingZone.minOrder,
        areaName: matchingZone.areaName,
        message: `Delivery available for ${matchingZone.areaName}`,
      });
    }

    // Dynamic Geocoding + Haversine distance calculation
    const coords = await geocodePostalCode(cleanPostalCode, cleanCity);
    if (!coords) {
      return res.json({
        deliverable: false,
        distanceKm: 0,
        deliveryFee: 0,
        message: "We do not deliver to your area.",
      });
    }

    const distanceKm = calculateHaversineDistance(
      RESTAURANT_LAT,
      RESTAURANT_LNG,
      coords.lat,
      coords.lng
    );

    let deliveryFee = 0;
    let deliverable = true;

    if (distanceKm <= 2.0) {
      deliveryFee = 2.0;
    } else if (distanceKm <= 5.0) {
      deliveryFee = 4.0;
    } else if (distanceKm <= 10.0) {
      deliveryFee = 7.0;
    } else {
      deliverable = false;
    }

    if (!deliverable) {
      return res.json({
        deliverable: false,
        distanceKm,
        deliveryFee: 0,
        message: `Sorry, we do not deliver to your area (${distanceKm} km away. Maximum delivery radius is 10 km).`,
      });
    }

    return res.json({
      deliverable: true,
      distanceKm,
      deliveryFee,
      message: `Delivery available (${distanceKm} km away)`,
    });
  } catch (err) {
    console.error("calculateDeliveryFee error:", err);
    return res.status(500).json({
      deliverable: false,
      deliveryFee: 0,
      error: "Could not calculate delivery fee.",
    });
  }
};