import { WeeklyRecipeItem } from '../types';
import { IMAGE_PRESETS } from '../utils/imageAssets';

export interface PastWeeklyRecipeItem extends WeeklyRecipeItem {
  weekDate: string;
  season: 'Summer' | 'Autumn' | 'Winter' | 'Spring';
  category: 'Jams & Jellies' | 'Pickles & Relish' | 'Salsa & Tomatoes' | 'Soups & Meats' | 'Fruit Preserves';
  isPaywalled: boolean; // Past recipes are behind the paywall
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  optInWeeklyEmail: boolean;
  subscribedAt: string;
  source: string;
}

export const PAST_WEEKLY_RECIPES: PastWeeklyRecipeItem[] = [
  {
    id: 'rec-2026-w31',
    weekDate: 'Week 31 - August 2026',
    season: 'Summer',
    category: 'Fruit Preserves',
    title: 'Citrus Honey Peach Jam',
    subtitle: 'Fresh Citrus & Golden Honey Peach Preserve for Water Bath Canning',
    description: 'A vibrant home jam featuring sweet summer peaches, freshly squeezed citrus notes, and organic golden clover honey.',
    prepTime: '20 Mins',
    processingTime: '10 Mins (Water Bath)',
    yieldJars: '6 Half-Pint (8 oz) Jars',
    method: 'Water Bath Canner',
    headspace: '1/4 inch',
    imageUrl: IMAGE_PRESETS.womanCanning2,
    author: 'JarCheck Recipe Kitchen',
    usdaVerifiedDate: 'August 2026',
    isPaywalled: false, // Newest recipe is free / emailed
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
        detail: 'Stir in pectin and honey. Bring mixture to a rolling boil over high heat, stirring constantly.'
      },
      {
        stepNumber: 3,
        title: 'Sugar Boil & Jar Fill',
        detail: 'Add sugar, return to a full rolling boil for 1 minute. Ladle into clean jars leaving 1/4 inch headspace.'
      },
      {
        stepNumber: 4,
        title: 'Water Bath Processing',
        detail: 'Process half-pint jars in a boiling water bath canner for 10 minutes.'
      }
    ],
    safetyChecklist: [
      'Bottled lemon juice verified at 5% acidity',
      'Headspace verified at 1/4 inch',
      'Boiling water cover maintained 1-2 inches over jar lids'
    ]
  },
  {
    id: 'rec-2026-w30',
    weekDate: 'Week 30 - July 2026',
    season: 'Summer',
    category: 'Pickles & Relish',
    title: 'Garlic Dill Kirby Pickle Spears',
    subtitle: 'Crispy Garlic Dill Pickles with 5% Acid Vinegar Brine',
    description: 'Crisp cucumber spears infused with smashed garlic cloves, fresh dill sprigs, and mustard seed in a balanced 50/50 vinegar brine.',
    prepTime: '25 Mins',
    processingTime: '15 Mins (Water Bath)',
    yieldJars: '4 Quart (32 oz) Jars',
    method: 'Water Bath Canner',
    headspace: '1/2 inch',
    imageUrl: IMAGE_PRESETS.cansOnShelf1,
    author: 'USDA Tested Adaptation',
    usdaVerifiedDate: 'July 2026',
    isPaywalled: true, // Past recipe is paywalled
    ingredients: [
      '4 lbs firm Kirby pickling cucumbers (cut into spears)',
      '3 cups white distilled vinegar (strictly 5% acidity)',
      '3 cups filtered water',
      '1/4 cup canning & pickling salt (non-iodized)',
      '8 garlic cloves & 4 dill heads'
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Brine Preparation',
        detail: 'Bring vinegar, water, and pickling salt to a rolling boil in a non-reactive stainless steel saucepan.'
      },
      {
        stepNumber: 2,
        title: 'Jar Packing',
        detail: 'Pack cucumber spears tightly into warm quart jars, leaving 1/2 inch headspace. Add 2 garlic cloves and 1 dill head per jar.'
      },
      {
        stepNumber: 3,
        title: 'Ladle Brine & Seal',
        detail: 'Ladle boiling brine over pickles, remove air bubbles with a bubble popper tool, adjust headspace to 1/2 inch, and wipe rims.'
      },
      {
        stepNumber: 4,
        title: 'Water Bath Processing',
        detail: 'Process quart jars for 15 minutes in a boiling water bath canner.'
      }
    ],
    safetyChecklist: [
      'Strict 1:1 vinegar to water ratio (minimum 5% acidity)',
      'Non-iodized pickling salt used to avoid brine clouding',
      'Processed for 15 minutes at sea level'
    ]
  },
  {
    id: 'rec-2026-w29',
    weekDate: 'Week 29 - July 2026',
    season: 'Summer',
    category: 'Salsa & Tomatoes',
    title: 'Acidified Roasted Tomato Salsa',
    subtitle: 'Fire-Roasted Tomato & Jalapeño Salsa for Safe Home Canning',
    description: 'Chunky roasted tomato salsa balanced with lime juice and bottled lemon juice to guarantee safe pH levels under 4.6.',
    prepTime: '30 Mins',
    processingTime: '15 Mins (Water Bath)',
    yieldJars: '5 Pint (16 oz) Jars',
    method: 'Water Bath Canner',
    headspace: '1/2 inch',
    imageUrl: IMAGE_PRESETS.womanCanning1,
    author: 'Master Food Preserver Board',
    usdaVerifiedDate: 'July 2026',
    isPaywalled: true, // Past recipe is paywalled
    ingredients: [
      '7 cups diced fire-roasted Roma tomatoes',
      '2 cups diced green bell peppers',
      '1 cup chopped yellow onions',
      '1/2 cup bottled lemon juice (mandatory acidifier)',
      '3 jalapeno peppers (minced)'
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Roast Tomatoes & Peppers',
        detail: 'Broil tomatoes and peppers until skins char and blister, then chop coarsely.'
      },
      {
        stepNumber: 2,
        title: 'Acidification & Simmer',
        detail: 'Combine tomatoes, vegetables, and mandatory 1/2 cup bottled lemon juice in a stockpot. Simmer 10 minutes.'
      },
      {
        stepNumber: 3,
        title: 'Process Jars',
        detail: 'Ladle hot salsa into pint jars leaving 1/2 inch headspace. Process in boiling water bath for 15 minutes.'
      }
    ],
    safetyChecklist: [
      'Mandatory 1/2 cup bottled lemon juice added for pH compliance',
      'Headspace measured at 1/2 inch'
    ]
  },
  {
    id: 'rec-2026-w28',
    weekDate: 'Week 28 - June 2026',
    season: 'Spring',
    category: 'Soups & Meats',
    title: 'Rich Pressure-Canned Chicken Stock',
    subtitle: 'Golden Slow-Simmered Chicken Broth for Dial/Weighted Gauge Canners',
    description: 'Nourishing, collagen-rich bone broth pressure canned according to USDA bulletin guidelines for low-acid broths.',
    prepTime: '45 Mins',
    processingTime: '20 Mins at 11 PSI (Pints) / 25 Mins (Quarts)',
    yieldJars: '7 Quart (32 oz) Jars',
    method: 'Pressure Canner',
    headspace: '1 inch',
    imageUrl: IMAGE_PRESETS.canningPrep,
    author: 'USDA Pressure Canning Spec',
    usdaVerifiedDate: 'June 2026',
    isPaywalled: true, // Past recipe is paywalled
    ingredients: [
      '5 lbs chicken bones & cartilage',
      '12 cups filtered water',
      '2 carrots & 2 celery stalks (chopped)',
      '1 onion & 2 bay leaves'
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Simmer & Skim Fat',
        detail: 'Simmer bones and vegetables for 4 hours. Strain broth and chill overnight to remove all solidified surface fat.'
      },
      {
        stepNumber: 2,
        title: 'Reheat & Jar Filling',
        detail: 'Reheat fat-skimmed broth to a boiling boil. Ladle into quart jars leaving 1 inch headspace.'
      },
      {
        stepNumber: 3,
        title: 'Pressure Canning',
        detail: 'Process quart jars in a calibrated pressure canner at 11 PSI (dial gauge) for 25 minutes.'
      }
    ],
    safetyChecklist: [
      'Surface fat skimmed before canning to prevent seal failure',
      'Pressure canner vented for 10 full minutes before pressurizing',
      'Processed at 11 PSI at sea level'
    ]
  },
  {
    id: 'rec-2026-w27',
    weekDate: 'Week 27 - June 2026',
    season: 'Spring',
    category: 'Jams & Jellies',
    title: 'Spiced Strawberry Rhubarb Jam',
    subtitle: 'Classic Tangy-Sweet Spring Preserve with Powdered Pectin',
    description: 'Tart field rhubarb blended with ripe strawberries and warm nutmeg spices, set with low-sugar powdered pectin.',
    prepTime: '20 Mins',
    processingTime: '10 Mins (Water Bath)',
    yieldJars: '6 Half-Pint (8 oz) Jars',
    method: 'Water Bath Canner',
    headspace: '1/4 inch',
    imageUrl: IMAGE_PRESETS.womanCanning2,
    author: 'JarCheck Test Kitchen',
    usdaVerifiedDate: 'June 2026',
    isPaywalled: true, // Past recipe is paywalled
    ingredients: [
      '3 cups crushed strawberries',
      '2 cups finely chopped rhubarb',
      '1/4 cup bottled lemon juice',
      '1 box low-sugar pectin',
      '4 cups sugar'
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Fruit Cookdown',
        detail: 'Simmer strawberries, rhubarb, and bottled lemon juice for 5 minutes until soft.'
      },
      {
        stepNumber: 2,
        title: 'Pectin Boil & Processing',
        detail: 'Add pectin, bring to boil, add sugar, boil hard for 1 minute. Ladle into jars leaving 1/4 inch headspace and process 10 minutes.'
      }
    ],
    safetyChecklist: [
      'Bottled lemon juice added for pH stability',
      '1/4 inch headspace maintained'
    ]
  }
];
