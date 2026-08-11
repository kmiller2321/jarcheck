// Centralized Unsplash image URLs for JarCheck home canning assistant
// Provides fast, highly reliable, beautiful HTTPS imagery with built-in SVG data URI fallbacks

const pantryImg1 = '/images/regenerated_image_1785956340264.png';
const pantryImg2 = '/images/regenerated_image_1785956344791.jpg';
const pantryImg3 = '/images/regenerated_image_1785956344985.jpg';
const heroRecipeImg = '/images/regenerated_image_1785958074297.png';

// Base SVG fallback (canning jar illustration) if network or image fails
export const CANNING_JAR_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f97316"/><path d="M220 120 h160 v20 h-160 z M240 140 h120 v220 h-120 z" fill="%23ffffff" opacity="0.9"/><circle cx="300" cy="240" r="40" fill="%23ea580c"/><text x="300" y="380" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23ffffff" text-anchor="middle">JarCheck Safe Canning</text></svg>`;

export const PANTRY_IMAGE_1 = pantryImg1;
export const PANTRY_IMAGE_2 = pantryImg2;
export const PANTRY_IMAGE_3 = pantryImg3;

export const REGENERATED_IMAGE_185 = pantryImg1;
export const REGENERATED_IMAGE_753 = pantryImg2;

export const IMAGE_PRESETS = {
  // Main hero and featured canning imagery
  womanCanning1: pantryImg3,
  womanCanning2: heroRecipeImg,
  cansOnShelf1: pantryImg2,
  canningPrep: pantryImg1,
  
  // High quality Unsplash alternatives for canning categories
  jams: pantryImg1,
  pickles: pantryImg2,
  tomatoes: pantryImg3,
  pantry: pantryImg2,
  logo: pantryImg1,
};

// Helper function to resolve any legacy /images/* path into a working asset or HTTPS URL
export function resolveImagePath(path: string | undefined): string {
  if (!path) return IMAGE_PRESETS.cansOnShelf1;
  
  // If already full HTTP/HTTPS or data URI, return as is
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Handle local /images/ references cleanly
  const normalized = path.toLowerCase();
  
  if (normalized.includes('woman_canning_1') || normalized.includes('womancanning1')) {
    return IMAGE_PRESETS.womanCanning1;
  }
  if (normalized.includes('woman_canning_2') || normalized.includes('womancanning2')) {
    return IMAGE_PRESETS.womanCanning2;
  }
  if (normalized.includes('cans_on_shelf_1') || normalized.includes('cansonshelf1')) {
    return IMAGE_PRESETS.cansOnShelf1;
  }
  if (normalized.includes('cookpad_canning_prep') || normalized.includes('cookpad')) {
    return IMAGE_PRESETS.canningPrep;
  }
  
  return IMAGE_PRESETS.cansOnShelf1;
}
