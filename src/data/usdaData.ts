import { PresetRecipe, SafetyAnalysisResult, CanningBatch, WeeklyRecipeItem } from '../types';
import { IMAGE_PRESETS, PANTRY_IMAGE_1, PANTRY_IMAGE_2, PANTRY_IMAGE_3 } from '../utils/imageAssets';

export const PRESET_RECIPES: PresetRecipe[] = [
  {
    id: 'jam-safe',
    title: 'Grandma’s Strawberry Mint Jam',
    description: 'Classic high-acid fruit jam preserved with bottled lemon juice.',
    badge: 'SAFE',
    recipeText: `Grandma's Strawberry Mint Jam
Ingredients:
- 4 cups crushed fresh strawberries
- 1/4 cup bottled lemon juice (strictly bottled)
- 1 box (1.75 oz) powdered fruit pectin
- 7 cups granulated white sugar
- 6 fresh mint leaves (finely chopped)

Directions:
Combine crushed strawberries, bottled lemon juice, chopped mint, and pectin in a large stainless steel pot. Bring to a rolling boil over high heat. Add all sugar at once and boil hard for 1 full minute while stirring constantly. Ladle hot jam into sterilized half-pint mason jars, leaving 1/4 inch headspace. Wipe jar rims, apply two-piece lids, and process in a boiling Water Bath Canner for 10 minutes (0-1,000 ft altitude).`
  },
  {
    id: 'soup-danger',
    title: 'Creamy Harvest Pumpkin Mushroom Soup',
    description: 'DANGER: Contains flour thickener, dairy cream, and pureed pumpkin.',
    badge: 'DANGER',
    recipeText: `Creamy Harvest Pumpkin & Wild Mushroom Soup
Ingredients:
- 4 cups homemade pumpkin puree (mashed fresh)
- 2 cups heavy cream
- 1/4 cup salted butter
- 2 cups diced wild mushrooms
- 3 tbsp all-purpose flour (for thickening)
- 1 tsp salt, nutmeg, and black pepper

Directions:
Melt butter in saucepan, stir in flour to make a thick roux. Stir in heavy cream and fresh pumpkin puree until velvety smooth. Add diced mushrooms and bring to a simmer. Pour into quart jars leaving 1/2 inch headspace and process in a hot water bath for 45 minutes.`
  },
  {
    id: 'salsa-warning',
    title: 'Rustic Garden Tomato Salsa',
    description: 'CAUTION: Low-acid tomatoes & peppers require added acidifier to be safe for Water Bathing.',
    badge: 'WARNING',
    recipeText: `Rustic Garden Tomato Salsa
Ingredients:
- 6 cups chopped ripe garden tomatoes
- 2 cups chopped green bell peppers
- 1 cup diced yellow onions
- 3 jalapeño peppers (minced)
- 2 cloves fresh garlic (minced)
- 1/2 cup fresh cilantro
- 1 tsp salt

Directions:
Combine all ingredients in a large stockpot and simmer for 15 minutes. Ladle hot salsa into pint jars with 1/2 inch headspace. Process in a boiling water bath canner for 15 minutes.`
  },
  {
    id: 'pickles-safe',
    title: 'Crispy Dill Pickle Spears',
    description: 'Verified high-acid pickling recipe with 5% acid vinegar ratio.',
    badge: 'SAFE',
    recipeText: `Crispy Dill Pickle Spears
Ingredients:
- 4 lbs Kirby cucumbers (cut into spears)
- 3 cups water
- 3 cups white distilled vinegar (5% acidity)
- 1/4 cup canning and pickling salt
- 4 garlic cloves
- 4 sprigs fresh dill weed
- 2 tsp mustard seeds

Directions:
Heat water, vinegar, and pickling salt to a boil. Pack cucumber spears, garlic, dill, and mustard seeds tightly into quart jars. Pour hot vinegar brine over pickles leaving 1/2 inch headspace. Process in a boiling water bath canner for 15 minutes.`
  }
];

export const INITIAL_PANTRY_BATCHES: CanningBatch[] = [
  {
    id: 'batch-001',
    batchCode: 'PC-2026-0801',
    recipeName: 'Spiced Peach Jam',
    canningDate: '2026-08-01',
    jarCount: 8,
    jarSize: 'Half-Pint (8 oz)',
    processingMethod: 'Water Bath Canner',
    psi: 'N/A (Water Bath)',
    headspace: '1/4 inch',
    processingTimeMinutes: '10 Mins',
    altitudeFeet: 650,
    phLevel: 3.8,
    status: 'Sealed & Shelf Ready',
    notes: 'Used 5% acidity lemon juice & fresh peaches. All 8 lids pinged and vacuum sealed within 15 minutes.',
    expirationDate: '2027-08-01',
    image: PANTRY_IMAGE_1
  },
  {
    id: 'batch-002',
    batchCode: 'PC-2026-0728',
    recipeName: 'Pickled Garden Beans',
    canningDate: '2026-07-28',
    jarCount: 6,
    jarSize: 'Pint (16 oz)',
    processingMethod: 'Water Bath Canner',
    psi: 'N/A (Water Bath)',
    headspace: '1/2 inch',
    processingTimeMinutes: '15 Mins',
    altitudeFeet: 650,
    phLevel: 3.6,
    status: 'Sealed & Shelf Ready',
    notes: '5% acidity white vinegar brine with dill weed & garlic cloves. Crisp texture verified.',
    expirationDate: '2027-07-28',
    image: PANTRY_IMAGE_2
  },
  {
    id: 'batch-003',
    batchCode: 'PC-2026-0715',
    recipeName: 'Tomato Basil Sauce',
    canningDate: '2026-07-15',
    jarCount: 10,
    jarSize: 'Pint (16 oz)',
    processingMethod: 'Water Bath Canner',
    psi: 'N/A (Water Bath)',
    headspace: '1/2 inch',
    processingTimeMinutes: '35 Mins',
    altitudeFeet: 650,
    phLevel: 4.1,
    status: 'Sealed & Shelf Ready',
    notes: 'Acidified with 1 tbsp bottled lemon juice per pint jar as required by USDA guidelines.',
    expirationDate: '2027-07-15',
    image: PANTRY_IMAGE_3
  },
  {
    id: 'batch-004',
    batchCode: 'PC-2026-0620',
    recipeName: 'Chicken Stock',
    canningDate: '2026-06-20',
    jarCount: 12,
    jarSize: 'Quart (32 oz)',
    processingMethod: 'Pressure Canner',
    psi: '11 PSI (Dial Gauge)',
    headspace: '1 inch',
    processingTimeMinutes: '25 Mins',
    altitudeFeet: 1200,
    phLevel: 6.2,
    status: 'Sealed & Shelf Ready',
    notes: 'Processed at 11 PSI for 25 minutes. Fat skimmed thoroughly prior to pressure canning.',
    expirationDate: '2027-06-20',
    image: IMAGE_PRESETS.canningPrep
  }
];

export const WEEKLY_RECIPE: WeeklyRecipeItem = {
  id: 'weekly-citrus-peach',
  title: 'Citrus Honey Peach Jam',
  subtitle: 'Fresh Citrus & Golden Honey Peach Preserve for Water Bath Canning',
  description: 'A vibrant home jam featuring sweet summer peaches, freshly squeezed citrus notes, and organic golden clover honey. Balanced specifically for home water bath processing.',
  prepTime: '20 Mins',
  processingTime: '10 Mins (Water Bath)',
  yieldJars: '6 Half-Pint (8 oz) Jars',
  method: 'Water Bath Canner',
  headspace: '1/4 inch',
  imageUrl: IMAGE_PRESETS.womanCanning2,
  author: 'JarCheck Recipe Kitchen',
  usdaVerifiedDate: 'August 2026',
  ingredients: [
    '4 cups peeled, pitted, and chopped ripe peaches',
    '1/4 cup bottled lemon juice (strictly 5% acidity for safety)',
    '1/2 cup raw clover honey & 3.5 cups granulated sugar',
    '1 box (1.75 oz) powdered fruit pectin',
    '1 tsp grated lemon zest'
  ],
  instructions: [
    {
      stepNumber: 1,
      title: 'Fruit & Acid Prep',
      detail: 'Combine chopped peaches, lemon zest, and mandatory 1/4 cup bottled lemon juice in a large stockpot.',
      safetyNote: 'Bottled lemon juice provides predictable 5% acidity necessary for safe water bath canning.'
    },
    {
      stepNumber: 2,
      title: 'Pectin & Honey Boil',
      detail: 'Stir in pectin and honey. Bring mixture to a rolling boil over high heat, stirring constantly.',
      safetyNote: 'Maintain constant stirring to prevent scorching.'
    },
    {
      stepNumber: 3,
      title: 'Sugar Boil & Jar Fill',
      detail: 'Add sugar, return to a full rolling boil for 1 minute. Ladle into clean jars leaving 1/4 inch headspace.',
      safetyNote: 'Check 1/4 inch headspace with a headspace gauge tool before applying lids.'
    },
    {
      stepNumber: 4,
      title: 'Water Bath Processing',
      detail: 'Process half-pint jars in a boiling water bath canner for 10 minutes (adjust for altitude).',
      safetyNote: 'Allow jars to cool undisturbed on a towel for 12-24 hours before testing seals.'
    }
  ],
  safetyChecklist: [
    'Bottled lemon juice verified at 5% acidity',
    'Headspace verified at 1/4 inch',
    'Boiling water cover maintained 1-2 inches over jar lids',
    'Vacuum seals inspected after 24-hour cooling period'
  ]
};

// Client-side USDA Rule Scanner Fallback function
export function scanRecipeUSDA(title: string, recipeText: string, jarSize: string = 'Pint (16 oz)'): SafetyAnalysisResult {
  const textLower = (title + ' ' + recipeText).toLowerCase();

  const redFlags = [];
  const safeAlternatives = [];
  let score = 95;
  let method: 'WATER_BATH' | 'PRESSURE_CANNER' | 'NOT_SAFE' = 'WATER_BATH';
  let status: 'VERIFIED_SAFE' | 'SAFE_WITH_MODIFICATIONS' | 'HIGH_RISK_DANGER' = 'VERIFIED_SAFE';
  let estimatedPh = 3.9;

  // 1. Check Dairy & Fats
  if (textLower.match(/\b(milk|cream|butter|cheese|sour cream|yogurt|lard|margarine|shortening|oil)\b/)) {
    const matched = textLower.match(/\b(milk|cream|butter|cheese|sour cream|yogurt|lard|margarine|shortening|oil)\b/)?.[0] || 'dairy/fat';
    redFlags.push({
      keyword: matched,
      severity: 'DANGER' as const,
      reason: `USDA Warning: ${matched} contains fats or dairy that coat bacteria, prevent uniform heat penetration, and spoil rapidly.`,
      category: 'DAIRY_OIL' as const
    });
    safeAlternatives.push({
      original: matched,
      replacement: 'Add dairy/fats fresh at serving time after opening jar',
      rationale: 'Dairy and fats cannot be safely canned in home water bath or pressure canners.'
    });
    score -= 40;
    method = 'NOT_SAFE';
    status = 'HIGH_RISK_DANGER';
  }

  // 2. Check Flour & Thickening Agents
  if (textLower.match(/\b(flour|cornstarch|arrowroot|tapioca|pasta|rice|noodles|thickener|roux|gravy mix)\b/)) {
    const matched = textLower.match(/\b(flour|cornstarch|arrowroot|tapioca|pasta|rice|noodles|thickener|roux|gravy mix)\b/)?.[0] || 'starch thickener';
    redFlags.push({
      keyword: matched,
      severity: 'DANGER' as const,
      reason: `USDA Danger: ${matched} slows down heat transfer to the cold spot of the jar, creating extreme risk of Clostridium botulinum survival.`,
      category: 'THICKENER' as const
    });
    safeAlternatives.push({
      original: matched,
      replacement: 'Use ClearJel® (modified cornstarch approved by USDA) or thicken fresh when serving',
      rationale: 'Standard flour, cornstarch, and pasta expand and block heat distribution during processing.'
    });
    score -= 45;
    method = 'NOT_SAFE';
    status = 'HIGH_RISK_DANGER';
  }

  // 3. Check Pumpkin Puree / Mashed Squash
  if (textLower.match(/\b(pumpkin puree|mashed pumpkin|squash puree|mashed squash|butter puree)\b/)) {
    redFlags.push({
      keyword: 'pumpkin puree',
      severity: 'DANGER' as const,
      reason: 'USDA Danger: Pureed pumpkin/squash density varies widely and heat cannot penetrate safely even in pressure canners.',
      category: 'DENSITY' as const
    });
    safeAlternatives.push({
      original: 'Pumpkin Puree',
      replacement: 'Pressure can pumpkin in 1-inch CUBES in water, then puree after opening jar',
      rationale: 'Cubic pumpkin allows proper liquid heat flow; pureed pumpkin is prohibited for home canning.'
    });
    score -= 50;
    method = 'NOT_SAFE';
    status = 'HIGH_RISK_DANGER';
  }

  // 4. Check Low Acid Ingredients (Meat, Vegetables, Broth, Beans)
  const isLowAcid = textLower.match(/\b(beef|chicken|pork|meat|broth|soup|stock|mushroom|mushrooms|green beans|peas|corn|carrots|beans|potatoes|peppers|squash)\b/);
  const hasAcidifier = textLower.match(/\b(bottled lemon juice|lemon juice|vinegar|citric acid|lime juice)\b/);

  if (isLowAcid && method !== 'NOT_SAFE') {
    estimatedPh = 5.8;
    if (!hasAcidifier) {
      method = 'PRESSURE_CANNER';
      score -= 15;
      if (status !== 'HIGH_RISK_DANGER') status = 'SAFE_WITH_MODIFICATIONS';
      
      redFlags.push({
        keyword: isLowAcid[0],
        severity: 'WARNING' as const,
        reason: `Low-Acid Item Detected (${isLowAcid[0]}): pH is above 4.6. Cannot be canned in a Water Bath Canner. Must use a Pressure Canner.`,
        category: 'LOW_ACID' as const
      });
      safeAlternatives.push({
        original: 'Water Bath Canner for low-acid foods',
        replacement: 'Use a Dial-Gauge or Weighted-Gauge Pressure Canner (11-15 PSI depending on altitude)',
        rationale: 'Water bath temperature (212°F / 100°C) is insufficient to kill botulinum spores in low-acid foods. Pressure canning reaches 240°F.'
      });
    } else {
      // Acidified low-acid (like pickled peppers or salsa)
      estimatedPh = 4.2;
      redFlags.push({
        keyword: 'acidification required',
        severity: 'WARNING' as const,
        reason: 'Low-acid vegetables present. Ensure bottled acidifier ratio strictly meets USDA standards (e.g. 2 tbsp bottled lemon juice per quart).',
        category: 'LOW_ACID' as const
      });
    }
  }

  // 5. Check Tomato Acidification
  if (textLower.includes('tomato') && !hasAcidifier && method === 'WATER_BATH') {
    score -= 20;
    status = 'SAFE_WITH_MODIFICATIONS';
    redFlags.push({
      keyword: 'tomatoes without acid',
      severity: 'WARNING' as const,
      reason: 'USDA Mandatory Rule: Modern tomato varieties often have pH near 4.6. Acidification (bottled lemon juice/citric acid) is mandatory.',
      category: 'LOW_ACID' as const
    });
    safeAlternatives.push({
      original: 'Plain tomatoes',
      replacement: 'Add 2 tbsp bottled lemon juice OR 1/2 tsp citric acid per quart jar (1 tbsp lemon juice per pint)',
      rationale: 'Guarantees pH remains below 4.6 safety threshold for water bath processing.'
    });
  }

  // Jar Size Normalization & Guidelines Adjustment
  const jarLower = jarSize.toLowerCase();
  let normalizedJarSize = 'Pint (16 oz)';
  if (jarLower.includes('1/2') || jarLower.includes('half-pint') || jarLower.includes('half pint')) {
    normalizedJarSize = '1/2 Pint (8 oz)';
  } else if (jarLower.includes('half gallon') || jarLower.includes('half-gallon') || jarLower.includes('64 oz')) {
    normalizedJarSize = 'Half Gallon (64 oz)';
  } else if (jarLower.includes('gallon') || jarLower.includes('128 oz')) {
    normalizedJarSize = 'Gallon (128 oz)';
  } else if (jarLower.includes('quart') || jarLower.includes('32 oz')) {
    normalizedJarSize = 'Quart (32 oz)';
  } else if (jarLower.includes('pint') || jarLower.includes('16 oz')) {
    normalizedJarSize = 'Pint (16 oz)';
  }

  let processingTimeMinutes = 15;
  let recommendedHeadspace = '1/4 inch';
  let jarSizeSafetyNote: string | undefined = undefined;

  const isJamJelly = textLower.match(/\b(jam|jelly|preserves|marmalade|berry|strawberry|peach|fruit)\b/);
  const isJuice = textLower.match(/\b(apple juice|grape juice|fruit juice|juice|cider)\b/);

  if (method === 'WATER_BATH') {
    if (normalizedJarSize === '1/2 Pint (8 oz)') {
      processingTimeMinutes = isJamJelly ? 10 : 15;
      recommendedHeadspace = isJamJelly ? '1/4 inch' : '1/2 inch';
    } else if (normalizedJarSize === 'Pint (16 oz)') {
      processingTimeMinutes = isJamJelly ? 10 : 15;
      recommendedHeadspace = isJamJelly ? '1/4 inch' : '1/2 inch';
    } else if (normalizedJarSize === 'Quart (32 oz)') {
      processingTimeMinutes = isJamJelly ? 15 : 20;
      recommendedHeadspace = '1/2 inch';
    } else if (normalizedJarSize === 'Half Gallon (64 oz)') {
      processingTimeMinutes = 25;
      recommendedHeadspace = '1/2 inch';
      if (!isJuice) {
        score -= 25;
        if (status !== 'HIGH_RISK_DANGER') status = 'SAFE_WITH_MODIFICATIONS';
        redFlags.push({
          keyword: 'half gallon jar warning',
          severity: 'DANGER' as const,
          reason: 'USDA Safety Rule: Half-Gallon (64 oz) jars are ONLY NCHFP-approved for clear high-acid juices (e.g. Apple Juice, Grape Juice). They are NOT approved for jams, jellies, pickles, or vegetables due to center heat-penetration limits.',
          category: 'UNAPPROVED_METHOD' as const
        });
        jarSizeSafetyNote = '⚠️ Half-gallon jars are NOT USDA-approved for solid produce/jams. Only clear fruit juices may be canned in 64 oz jars.';
      } else {
        jarSizeSafetyNote = '✅ Half-gallon jars are USDA-approved specifically for clear high-acid fruit juices.';
      }
    } else if (normalizedJarSize === 'Gallon (128 oz)') {
      processingTimeMinutes = 0;
      recommendedHeadspace = '1 inch';
      score -= 40;
      status = 'HIGH_RISK_DANGER';
      method = 'NOT_SAFE';
      redFlags.push({
        keyword: 'gallon jar hazard',
        severity: 'DANGER' as const,
        reason: 'CRITICAL HAZARD: Gallon jars (128 oz) are strictly PROHIBITED for home canning by USDA/NCHFP. No home equipment can safely heat a 128 oz jar to destroy botulism spores.',
        category: 'UNAPPROVED_METHOD' as const
      });
      jarSizeSafetyNote = '🚨 GALLON JARS ARE STRICTLY PROHIBITED FOR HOME CANNING. Switch to Pint or Quart jars.';
    }
  } else if (method === 'PRESSURE_CANNER') {
    if (normalizedJarSize === '1/2 Pint (8 oz)') {
      processingTimeMinutes = 20;
      recommendedHeadspace = '1 inch';
    } else if (normalizedJarSize === 'Pint (16 oz)') {
      processingTimeMinutes = 25;
      recommendedHeadspace = '1 inch';
    } else if (normalizedJarSize === 'Quart (32 oz)') {
      processingTimeMinutes = 40;
      recommendedHeadspace = '1 to 1-1/4 inch';
    } else if (normalizedJarSize === 'Half Gallon (64 oz)') {
      processingTimeMinutes = 0;
      recommendedHeadspace = '1-1/4 inch';
      score -= 45;
      status = 'HIGH_RISK_DANGER';
      method = 'NOT_SAFE';
      redFlags.push({
        keyword: 'half gallon pressure canning hazard',
        severity: 'DANGER' as const,
        reason: 'USDA Prohibited: Half-gallon jars are NOT approved for pressure canning meats, poultry, or low-acid vegetables.',
        category: 'UNAPPROVED_METHOD' as const
      });
      jarSizeSafetyNote = '🚨 Half-gallon jars are PROHIBITED for pressure canning low-acid foods. Use Pint or Quart jars.';
    } else if (normalizedJarSize === 'Gallon (128 oz)') {
      processingTimeMinutes = 0;
      recommendedHeadspace = '1-1/2 inch';
      score -= 50;
      status = 'HIGH_RISK_DANGER';
      method = 'NOT_SAFE';
      redFlags.push({
        keyword: 'gallon jar pressure canning hazard',
        severity: 'DANGER' as const,
        reason: 'CRITICAL HAZARD: Gallon jars are strictly PROHIBITED for home pressure canning under USDA standards.',
        category: 'UNAPPROVED_METHOD' as const
      });
      jarSizeSafetyNote = '🚨 GALLON JARS ARE PROHIBITED FOR HOME CANNING. Use Pint or Quart jars.';
    }
  }

  // Final score clamping
  score = Math.max(0, Math.min(100, score));

  // Determine Guidelines based on method & jar size
  let guidelines = {
    jarSize: normalizedJarSize,
    processingTimeMinutes,
    recommendedHeadspace,
    psiDialGauge: method === 'PRESSURE_CANNER' ? '11 PSI (0-2,000 ft altitude)' : 'N/A (Water Bath)',
    psiWeightedGauge: method === 'PRESSURE_CANNER' ? '10 PSI (0-1,000 ft altitude)' : 'N/A (Water Bath)',
    altitudeAdjustment: 'Add +5 minutes for Water Bath or +1-2 PSI for Pressure Canner for every 1,000 ft elevation above sea level.',
    jarSizeSafetyNote
  };

  let summary = '';
  if (status === 'VERIFIED_SAFE') {
    summary = `VERIFIED USDA COMPLIANT for ${normalizedJarSize} jars: This recipe meets high-acid safety criteria and is approved for Water Bath Canning.`;
  } else if (status === 'SAFE_WITH_MODIFICATIONS') {
    summary = `MODIFICATION REQUIRED for ${normalizedJarSize} jars: This recipe contains low-acid ingredients, unacidified produce, or jar-size constraints. Switch to Pressure Canning, add mandatory bottled acidifier, or adjust jar size.`;
  } else {
    summary = `CRITICAL SAFETY HAZARD (UNSAFE FOR CANNING): This recipe contains unsafe ingredients (dairy, flour/thickener, oil, purees) or uses prohibited jar sizes (${normalizedJarSize}).`;
  }

  return {
    recipeTitle: title || 'Custom Home Recipe',
    selectedJarSize: normalizedJarSize,
    recipeText,
    safetyScore: score,
    status,
    processingMethod: method,
    estimatedPh,
    redFlags,
    safeAlternatives,
    canningGuidelines: guidelines,
    mandatoryWarning: 'CRITICAL SAFETY NOTICE: Always follow tested recipes from the USDA National Center for Home Food Preservation (NCHFP). Altering proportions, thickeners, jar sizes, or canning methods can result in severe illness or botulism poisoning.',
    summary,
    timestamp: new Date().toISOString()
  };
}
