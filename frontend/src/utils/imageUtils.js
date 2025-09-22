import heroImg from "../assets/hero.webp";
import featuredImg from "../assets/featured.webp";
import mensCollectionImg from "../assets/mens-collection.webp";
import womensCollectionImg from "../assets/womens-collection.webp";
// Simple image fallback utility to ensure fashion-relevant imagery
// Heuristics:
// - If image URL is missing or points to picsum.photos, replace with a category/gender themed fashion image

export const getFallbackByCategory = (category = "", gender = "") => {
  const g = (gender || "").toLowerCase();
  const c = (category || "").toLowerCase();

  // Map categories to existing photo assets
  if (c.includes("suit") || c.includes("dress shoes") || c.includes("trousers")) {
    return heroImg; // strong fashion photo
  }
  if (c.includes("shirt") || c.includes("dress shirts") || c.includes("top wear")) {
    return featuredImg;
  }
  if (c.includes("accessories")) {
    return mensCollectionImg;
  }
  // gender-based default
  return g === "women" ? womensCollectionImg : mensCollectionImg;
};

const shouldReplace = (url) => {
  if (!url) return true;
  try {
    const u = String(url).toLowerCase();
    if (u.includes("picsum.photos")) return true;
    if (u.includes("images.unsplash.com") || u.includes("unsplash.com")) return true;
    if (u.endsWith(".svg")) return true; // avoid text svg placeholders
  } catch (_) {}
  return false;
};

// Prefer DB image, fallback to local category-based photo
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

// Build a responsive srcSet by adjusting Unsplash width param
const setWidthParam = (url, width) => {
  try {
    const hasQuery = url.includes("?");
    let updated = url;
    if (updated.includes("w=")) {
      updated = updated.replace(/w=\d+/g, `w=${width}`);
    } else {
      updated += (hasQuery ? "&" : "?") + `w=${width}`;
    }
    if (!updated.includes("q=")) {
      updated += "&q=60";
    }
    if (!updated.includes("auto=format")) {
      updated += "&auto=format";
    }
    if (!updated.includes("fit=crop")) {
      updated += "&fit=crop";
    }
    return updated;
  } catch (_) {
    return url;
  }
};

export const buildSrcSet = (url) => {
  if (!url) return undefined;
  const widths = [300, 600, 900];
  return widths.map((w) => `${setWidthParam(url, w)} ${w}w`).join(", ");
};

export const defaultSizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";


