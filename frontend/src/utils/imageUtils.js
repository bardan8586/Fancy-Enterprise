// Simple image fallback utility to ensure fashion-relevant imagery
// Heuristics:
// - If image URL is missing or points to picsum.photos, replace with a category/gender themed fashion image

export const getFallbackByCategory = (category = "", gender = "") => {
  const g = (gender || "").toLowerCase();
  const c = (category || "").toLowerCase();

  // Map categories to search terms
  const categoryToQuery = {
    suits: "men suit formal",
    blazers: g === "women" ? "women blazer formal" : "men blazer formal",
    "dress shirts": "men dress shirt",
    trousers: g === "women" ? "women tailored trousers" : "men tailored trousers",
    "cocktail dresses": "cocktail dress",
    "evening gowns": "evening gown",
    skirts: "elegant skirt",
    heels: "women heels",
    "dress shoes": "men dress shoes",
    accessories: g === "women" ? "women luxury accessories" : "men luxury accessories",
  };

  const query =
    categoryToQuery[c] || (g === "women" ? "women evening wear" : "men formal wear");

  // Use Unsplash Source for relevant fashion images
  return `https://source.unsplash.com/600x800/?${encodeURIComponent(query)}`;
};

const shouldReplace = (url) => {
  if (!url) return true;
  try {
    const u = String(url).toLowerCase();
    if (u.includes("picsum.photos")) return true;
  } catch (_) {}
  return false;
};

export const getDisplayImage = (product) => {
  const primary = product?.images?.[0]?.url;
  if (shouldReplace(primary)) {
    return getFallbackByCategory(product?.category, product?.gender);
  }
  return primary;
};

export const getDisplayImages = (product) => {
  const imgs = Array.isArray(product?.images) ? product.images : [];
  if (imgs.length === 0) {
    const fallback = getFallbackByCategory(product?.category, product?.gender);
    return [{ url: fallback, altText: product?.name || "Product" }];
  }
  return imgs.map((img) => {
    if (shouldReplace(img?.url)) {
      return { url: getFallbackByCategory(product?.category, product?.gender), altText: img?.altText };
    }
    return img;
  });
};


