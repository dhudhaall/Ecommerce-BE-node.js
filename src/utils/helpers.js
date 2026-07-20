

export const attachProductImagesBaseUrl = (data, baseUrl) => {
  return data.map((category) => ({
    ...category,
    products:category?.products.length > 0 ? category?.products.map((product) => ({
      ...product,
      images: product?.images.length > 0 ? product?.images?.map((img) => ({
        ...img,
        url: baseUrl + img.url,
      })):[],
    })):[],
  }));
};

export const matchZone = (zones, typedCode) =>{
  const code = (typedCode || "").trim();
  if (code.length < 3) return null;
  return zones.find(
    (z) =>
      z.mainPostalCode === code ||
      z.coveredPrefixes.some((p) => code.startsWith(p))
  ) ?? null;
}