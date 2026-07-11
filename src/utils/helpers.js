

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