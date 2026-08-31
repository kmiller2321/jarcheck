import { TestimonialItem, CommunityQAItem, CommunityPhotoPost } from '../types';
import { IMAGE_PRESETS } from '../utils/imageAssets';

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    name: 'Eleanor Vance',
    role: 'Certified Extension Master Food Preserver',
    location: 'Boise, Idaho',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    quote: 'PreserveCheck has transformed how I teach home food preservation. The automated USDA red-flag scanner catches density risks like flour or pumpkin puree before anyone loads a canner.',
    rating: 5,
    yearsCanning: 22,
    verifiedUser: true,
    batchType: 'High-Altitude Pressure Canning'
  },
  {
    id: 'test-2',
    name: 'Marcus & Sarah Thorne',
    role: 'Small-Batch Homesteaders',
    location: 'Shenandoah Valley, VA',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    quote: 'We preserve over 400 quarts of garden produce annually. Being able to scan our grandmother’s old recipes for acid levels and print custom batch labels with batch codes gives us 100% peace of mind.',
    rating: 5,
    yearsCanning: 14,
    verifiedUser: true,
    batchType: 'Heirloom Tomato Salsa & Pickles'
  },
  {
    id: 'test-3',
    name: 'Dr. Evelyn Martinez',
    role: 'Food Microbiologist & Educator',
    location: 'Fort Collins, CO',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    quote: 'Botulism prevention requires zero compromise on pH and thermal processing. PreserveCheck’s precise altitude PSI calculations and paywalled Master Q&A make safe canning accessible to everyone.',
    rating: 5,
    yearsCanning: 18,
    verifiedUser: true,
    batchType: 'Low-Acid Vegetables & Stews'
  },
  {
    id: 'test-4',
    name: 'Clara Bennett',
    role: 'Suburban Backyard Gardener',
    location: 'Appleton, Wisconsin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    quote: 'As a beginner, I was terrified of making someone sick with my blackberry preserves. The step-by-step USDA safety checklists gave me the confidence to fill my cellar!',
    rating: 5,
    yearsCanning: 3,
    verifiedUser: true,
    batchType: 'Wild Berry Jams & Jellies'
  }
];

export const INITIAL_COMMUNITY_QA: CommunityQAItem[] = [
  {
    id: 'qa-1',
    question: 'How do I know if my jar lid has a true vacuum seal vs a false seal after processing?',
    category: 'Botulism Safety',
    askedBy: 'Hannah Miller',
    askedDate: '2 days ago',
    previewAnswer: 'A true vacuum seal happens when cooling air inside the jar contracts, pulling the concave metal lid flat with a distinctive high-pitched "ping"...',
    fullAnswer: 'MASTER CANNER SAFETY PROTOCOL:\n1. Cool jars undisturbed for 12 to 24 hours on a towel at room temperature. NEVER press down on hot lids right out of the canner.\n2. Remove the screw bands. Gently press the center of the metal lid. If it is flat and does not flex or pop up, the seal is held by vacuum.\n3. Lift the jar gently by the edges of the metal lid with your fingertips. If the lid stays firmly attached without the band, you have a verified vacuum seal.\n4. If a lid yields or pops, refrigerate the jar immediately and consume within 3 to 5 days, or reprocess within 24 hours with a fresh lid.',
    usdaReference: 'USDA Complete Guide to Home Canning, Guide 1 (Principles of Home Canning, p. 1-15)',
    viewsCount: 1420,
    helpfulCount: 389,
    isPaywalled: true
  },
  {
    id: 'qa-2',
    question: 'My pressure canner dropped below 11 PSI for 2 minutes halfway through the 75-minute process. What should I do?',
    category: 'Pressure Canning',
    askedBy: 'David K.',
    askedDate: '3 days ago',
    previewAnswer: 'When pressure drops below the required PSI for even a few seconds, heat penetration in the jar center drops below the thermal death point for C. botulinum spores...',
    fullAnswer: 'CRITICAL CORRECTION PROTOCOL:\nAccording to NCHFP standards, if pressure fluctuates or drops below your target elevation PSI at ANY point during the timer:\n1. Bring the pressure back up to the required target PSI (e.g. 11 PSI or 12 PSI for dial gauge at altitude).\n2. RE-START THE ENTIRE PROCESSING TIMER FROM ZERO (e.g., restart all 75 minutes).\n3. Rationale: Clostridium botulinum spores are heat-resistant. Partial heating allows spores to survive and germinate in low-acid, oxygen-free jars. Never attempt to "add a few extra minutes" to make up for a pressure dip.',
    usdaReference: 'NCHFP Pressure Canning Guidelines (Section 1.18: Interruptions in Processing)',
    viewsCount: 980,
    helpfulCount: 245,
    isPaywalled: true
  },
  {
    id: 'qa-3',
    question: 'Can I reduce sugar or use artificial sweetener in a traditional USDA jam recipe without safety risks?',
    category: 'Jams & Jellies',
    askedBy: 'Rachel Adams',
    askedDate: '1 week ago',
    previewAnswer: 'Sugar in traditional jam recipes serves two distinct roles: binding free water to inhibit mold growth and binding pectin for gelling...',
    fullAnswer: 'SAFETY & GEL ANALYSIS:\n1. Microbial Safety: In high-acid fruit jams (pH < 4.6), water-bath heat processing destroys pathogens. Lowering sugar does NOT cause botulism in acidic fruit, but drastically reduces shelf life and causes rapid mold spoilage once opened.\n2. Gelling Mechanics: Standard high-methoxyl pectin REQUIRES 55-65% sugar to set properly. If you reduce sugar, the jam will remain syrup.\n3. USDA Solution: Use Low-or-No-Sugar (LNS) modified pectin (low-methoxyl pectin), which sets with calcium rather than sugar, or follow USDA-tested pectin-free fruit spread guidelines.',
    usdaReference: 'USDA Complete Guide, Guide 7 (Jams and Jellies, p. 7-4)',
    viewsCount: 2150,
    helpfulCount: 512,
    isPaywalled: true
  },
  {
    id: 'qa-4',
    question: 'Why is adding flour, cornstarch, butter, or milk strictly prohibited in canned soups and stews?',
    category: 'Botulism Safety',
    askedBy: 'Gareth Vance',
    askedDate: '5 days ago',
    previewAnswer: 'Starches and fats create dense, viscous layers that impede convective heat transfer to the center of the jar during processing...',
    fullAnswer: 'DENSITY & THERMAL PENETRATION WARNING:\n1. Starch Insulation: Flour and cornstarch swell during processing, turning liquid into a thick gel. Heat penetrates gelatinous mass via slow conduction rather than fast liquid convection. Cold spots remain at the jar center where botulinum spores survive.\n2. Fat Rancidity & Spore Shielding: Fats insulate bacterial spores from heat death.\n3. Safe USDA Alternative: Can clear broth soups with diced vegetables and meats according to USDA soup timing (20 mins pints / 25 mins quarts). Thicken with flour, cream, or ClearJel ONLY when reheating the jar for serving!',
    usdaReference: 'NCHFP General Canning Guidelines: Thickening Agents in Home Preserving',
    viewsCount: 3100,
    helpfulCount: 870,
    isPaywalled: true
  },
  {
    id: 'qa-5',
    question: 'How do I acidify heirloom tomatoes properly for water bath or pressure canning?',
    category: 'Acid & pH',
    askedBy: 'Elena Rostova',
    askedDate: '4 days ago',
    previewAnswer: 'Modern tomato cultivars vary widely in natural acidity, frequently exceeding pH 4.6. All home-canned tomatoes MUST be acidified...',
    fullAnswer: 'MANDATORY USDA ACIDIFICATION DOSAGE:\nRegardless of whether you water-bath or pressure-can tomatoes, add acidity directly to each jar BEFORE filling:\n- Bottled Lemon Juice (4.5% acidity minimum): Add 1 tablespoon per pint jar OR 2 tablespoons per quart jar.\n- Citric Acid Powder: Add 1/4 teaspoon per pint jar OR 1/2 teaspoon per quart jar.\n- 5% Acidity Vinegar: Add 2 tablespoons per pint OR 4 tablespoons per quart (may alter flavor).\nNote: Do NOT use fresh-squeezed lemon juice as acid concentration varies unpredictably.',
    usdaReference: 'USDA Complete Guide, Guide 3 (Tomatoes and Tomato Products, p. 3-3)',
    viewsCount: 1890,
    helpfulCount: 430,
    isPaywalled: true
  },
  {
    id: 'qa-6',
    question: 'What causes "siphoning" (liquid loss from jars during canning) and are the jars still safe to eat?',
    category: 'Equipment & Lids',
    askedBy: 'Samuel T.',
    askedDate: '1 week ago',
    previewAnswer: 'Siphoning occurs when rapid pressure fluctuations force liquid out under the jar lid seal during or right after processing...',
    fullAnswer: 'SIPHONING DIAGNOSIS & CONSUMPTION SAFETY:\n1. Prevention: Maintain steady heat during pressure canning. Never force-cool the canner by lifting the weight or running cold water over the lid. Allow pressure to drop naturally to 0 PSI.\n2. Safety Assessment: If at least half the liquid remains in the jar AND the lid has achieved a tight vacuum seal, the food is safe to consume. However, exposed food above liquid line may discolor or develop off-flavors over time. Use those jars first!\n3. Discard Criteria: If liquid loss caused food particles to get trapped under the sealing rubber ring, causing a failed seal, refrigerate or reprocess immediately.',
    usdaReference: 'NCHFP Troubleshooting: Loss of Liquid from Jars during Processing',
    viewsCount: 1540,
    helpfulCount: 310,
    isPaywalled: true
  }
];

export const INITIAL_COMMUNITY_PHOTOS: CommunityPhotoPost[] = [
  {
    id: 'photo-1',
    title: 'Autumn Apple Butter & Cinnamon Jars',
    caption: 'Freshly sealed 8oz half-pint jars of slow-cooked Honeycrisp apple butter with lemon acidification.',
    author: 'Clara Bennett',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    location: 'Wisconsin, USA',
    imageUrl: IMAGE_PRESETS.cansOnShelf1,
    categoryTag: 'Jams & Preserves',
    postedDate: 'Today at 10:15 AM',
    likesCount: 48,
    aiVerified: true,
    detectedObjects: ['Mason Jars', 'Apple Butter', 'Pantry Shelf']
  },
  {
    id: 'photo-2',
    title: 'Pressure Canned Summer Sweet Corn Batch',
    caption: 'Processed 12 pint jars at 11 PSI for 55 minutes following USDA NCHFP guidelines. Perfect seals!',
    author: 'Marcus Thorne',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    location: 'Virginia, USA',
    imageUrl: IMAGE_PRESETS.womanCanning1,
    categoryTag: 'Pressure Canned',
    postedDate: 'Yesterday at 4:30 PM',
    likesCount: 72,
    aiVerified: true,
    detectedObjects: ['Canned Vegetables', 'Quart Jars', 'Pantry']
  },
  {
    id: 'photo-3',
    title: 'Crushed Tomatoes with Citric Acid',
    caption: 'Acidified with 1/2 tsp citric acid per quart. Heated water bath for 45 minutes.',
    author: 'Elena Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    location: 'Idaho, USA',
    imageUrl: IMAGE_PRESETS.womanCanning2,
    categoryTag: 'Jams & Preserves',
    postedDate: '2 days ago',
    likesCount: 95,
    aiVerified: true,
    detectedObjects: ['Tomato Jar', 'Glass Preserve', 'Cellar']
  },
  {
    id: 'photo-4',
    title: '2026 Winter Homestead Cellar Pantry Wall',
    caption: 'Fully organized pantry with JarCheck QR batch codes on every jar lid.',
    author: 'Dr. Evelyn Martinez',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    location: 'Colorado, USA',
    imageUrl: IMAGE_PRESETS.canningPrep,
    categoryTag: 'Pantry Shelf Showcase',
    postedDate: '3 days ago',
    likesCount: 134,
    aiVerified: true,
    detectedObjects: ['Cellar Shelves', 'Jar Collection', 'Pantry Display']
  }
];

export const STOCK_COMMUNITY_PHOTOS = [
  {
    title: 'Canning Batch Shelf',
    url: IMAGE_PRESETS.cansOnShelf1,
    categoryTag: 'Pantry Shelf Showcase' as const
  },
  {
    title: 'Artisan Canning Prep',
    url: IMAGE_PRESETS.womanCanning1,
    categoryTag: 'Pressure Canned' as const
  },
  {
    title: 'Fresh Preserves & Jams',
    url: IMAGE_PRESETS.womanCanning2,
    categoryTag: 'Jams & Preserves' as const
  },
  {
    title: 'Pantry Jar Display',
    url: IMAGE_PRESETS.canningPrep,
    categoryTag: 'Pantry Shelf Showcase' as const
  }
];
