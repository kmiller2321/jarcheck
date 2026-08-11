export type ProcessingMethod = 'WATER_BATH' | 'PRESSURE_CANNER' | 'NOT_SAFE';

export type SafetyStatus = 'VERIFIED_SAFE' | 'SAFE_WITH_MODIFICATIONS' | 'HIGH_RISK_DANGER';

export interface RedFlagItem {
  keyword: string;
  severity: 'DANGER' | 'WARNING';
  reason: string;
  category: 'THICKENER' | 'DAIRY_OIL' | 'LOW_ACID' | 'UNAPPROVED_METHOD' | 'DENSITY';
}

export interface SafeAlternative {
  original: string;
  replacement: string;
  rationale: string;
}

export interface CanningGuidelines {
  jarSize: string;
  processingTimeMinutes: number;
  recommendedHeadspace: string;
  psiDialGauge: string;
  psiWeightedGauge: string;
  altitudeAdjustment: string;
  jarSizeSafetyNote?: string;
}

export interface SafetyAnalysisResult {
  recipeTitle: string;
  selectedJarSize?: string;
  recipeText?: string;
  safetyScore: number; // 0 to 100
  status: SafetyStatus;
  processingMethod: ProcessingMethod;
  estimatedPh: number;
  redFlags: RedFlagItem[];
  safeAlternatives: SafeAlternative[];
  canningGuidelines: CanningGuidelines;
  mandatoryWarning: string;
  summary: string;
  timestamp: string;
}

export interface CanningBatch {
  id: string;
  batchCode: string;
  recipeName: string;
  canningDate: string;
  jarCount: number;
  jarSize: 'Half-Pint (8 oz)' | 'Pint (16 oz)' | 'Quart (32 oz)' | 'Gallon (Not Recommended)';
  processingMethod: 'Water Bath Canner' | 'Pressure Canner';
  psi: number | string;
  headspace: string;
  processingTimeMinutes?: number | string;
  altitudeFeet: number;
  phLevel: number;
  status: 'Sealed & Shelf Ready' | 'In Quarantine' | 'Consumed' | 'Unsealed - Refrigerate';
  notes?: string;
  image?: string;
  expirationDate: string;
}

export interface PresetRecipe {
  id: string;
  title: string;
  description: string;
  badge: 'DANGER' | 'WARNING' | 'SAFE';
  recipeText: string;
}

export interface WeeklyRecipeItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  prepTime: string;
  processingTime: string;
  yieldJars: string;
  method: 'Water Bath Canner' | 'Pressure Canner';
  headspace: string;
  ingredients: string[];
  instructions: { stepNumber: number; title: string; detail: string; safetyNote?: string }[];
  safetyChecklist: string[];
  imageUrl: string;
  author: string;
  usdaVerifiedDate: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
  yearsCanning: number;
  verifiedUser: boolean;
  batchType: string;
}

export interface CommunityQAItem {
  id: string;
  question: string;
  category: 'Botulism Safety' | 'Pressure Canning' | 'Acid & pH' | 'Jams & Jellies' | 'Equipment & Lids';
  askedBy: string;
  askedDate: string;
  previewAnswer: string;
  fullAnswer: string;
  usdaReference: string;
  viewsCount: number;
  helpfulCount: number;
  isPaywalled: boolean;
}

export interface CommunityPhotoPost {
  id: string;
  title: string;
  caption: string;
  author: string;
  authorAvatar: string;
  location: string;
  imageUrl: string;
  categoryTag: 'Jams & Preserves' | 'Pressure Canned' | 'Pickling & Ferments' | 'Pantry Shelf Showcase';
  postedDate: string;
  likesCount: number;
  aiVerified: boolean;
  detectedObjects?: string[];
}

export interface PhotoModerationResult {
  isSafe: boolean;
  confidenceScore: number;
  flaggedReason?: string | null;
  detectedObjects?: string[];
}

