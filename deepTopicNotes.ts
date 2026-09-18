export interface DeepLessonNote {
  topicTitle: string;
  subjectName: string;
  curiosityHook: string; // "Did You Know?" or intriguing real-world paradox
  deepOverview: string;  // Detailed, multi-paragraph deep breakdown
  corePrinciples: { title: string; detail: string }[];
  realWorldTanzaniaConnection: string; // Connection to Tanzania (Kilimanjaro, Serengeti, Tanzanite, etc.)
  workedExamples: { problem: string; solution: string; keyTakeaway: string }[];
  probingQuestions: string[]; // Curiosity questions that provoke deep thinking
  nectaExamTips: string[];   // NECTA national exam tips & common traps
  bilingualSwahiliNote: {
    heading: string;
    overview: string;
    keyPoints: string[];
  };
}

export const DEEP_TOPICS_DATABASE: Record<string, DeepLessonNote> = {
  // --- MATHEMATICS ---
  'quadratic equations & formula': {
    topicTitle: 'Quadratic Equations & Parabolic Motion',
    subjectName: 'Mathematics',
    curiosityHook: 'Did you know that when an eagle dives for fish in Lake Victoria or when a football is kicked in Mtapa Stadium, its flight path follows an exact mathematical curve called a parabola described by ax² + bx + c = 0?',
    deepOverview: `Quadratic equations are second-degree polynomial equations where the highest exponent of the variable is 2. They form the mathematical backbone of kinematics, architectural arch construction, optical satellite dish design, and financial profit optimization.

Unlike linear equations (which form straight lines with a constant rate of change), quadratic relationships involve acceleration and non-linear changes. When graphed on a Cartesian plane, a quadratic function f(x) = ax² + bx + c generates a symmetric curve known as a parabola. If 'a' > 0, the parabola opens upwards like a cup, forming a minimum vertex point. If 'a' < 0, the parabola opens downwards, reaching a maximum height—which is how projectile trajectories are calculated.`,
    corePrinciples: [
      { title: 'Standard Polynomial Form', detail: 'ax² + bx + c = 0, where a, b, c are real numbers and a ≠ 0.' },
      { title: 'The Quadratic Formula', detail: 'x = [-b ± √(b² - 4ac)] / (2a). Derived by completing the square on the general equation.' },
      { title: 'The Discriminant (Δ = b² - 4ac)', detail: 'Δ > 0 yields 2 distinct real roots; Δ = 0 yields 1 repeated real root; Δ < 0 yields 2 complex conjugate roots.' },
      { title: 'Vertex & Axis of Symmetry', detail: 'The line of symmetry is x = -b / (2a). The vertex coordinate is (-b / (2a), f(-b / (2a))).' }
    ],
    realWorldTanzaniaConnection: 'Engineers designing the Tanzam Highway bridges or calculating the maximum water output height of the Julius Nyerere Hydroelectric Power Dam spillway use parabolic quadratic equations to determine stress tolerance and fluid trajectories.',
    workedExamples: [
      {
        problem: 'Solve 2x² - 7x + 3 = 0 using the Quadratic Formula.',
        solution: 'Step 1: Identify coefficients: a = 2, b = -7, c = 3.\nStep 2: Calculate Discriminant Δ = (-7)² - 4(2)(3) = 49 - 24 = 25.\nStep 3: Apply formula: x = [7 ± √25] / (2 × 2) = [7 ± 5] / 4.\nStep 4: Root 1: x = (7 + 5)/4 = 12/4 = 3.\nRoot 2: x = (7 - 5)/4 = 2/4 = 0.5.',
        keyTakeaway: 'Always check if the discriminant is a perfect square (like 25). If it is, the roots are rational numbers!'
      }
    ],
    probingQuestions: [
      'Why can a real quadratic equation never have 3 distinct solutions?',
      'If you throw a ball upward on Mars where gravity is weaker, how does the coefficient "a" in the height equation h(t) = -0.5gt² + vt + c change?',
      'How do bridge architects use parabolas to distribute heavy loads evenly across suspension cables?'
    ],
    nectaExamTips: [
      'Always state values of a, b, and c explicitly before substituting into the formula to avoid sign errors with negative numbers.',
      'In NECTA Form 4 Paper 1, if asked to solve by "Completing the Square", you MUST show the step adding (b/2a)² to both sides, otherwise marks are deducted.'
    ],
    bilingualSwahiliNote: {
      heading: 'Mitihani ya Milinganyo ya Kipembetatu (Quadratic Equations)',
      overview: 'Milinganyo ya kiwango cha pili (ax² + bx + c = 0) inatusaidia kukokotoa mwendo wa vitu vinavyorushwa hewani au umbo la madaraja. Mfumo wa kanuni ya x = [-b ± √(b² - 4ac)] / (2a) hutatua milinganyo yote bila kujali kama inagawanyika au la.',
      keyPoints: [
        'Kizio a haipaswi kuwa sifuri (a ≠ 0).',
        'Kikokotoo cha Discriminant (b² - 4ac) kinatuambia idadi ya majibu halisi.',
        'Kama b² - 4ac ni sifuri, kuna jibu moja tu lililorudiwa.'
      ]
    }
  },

  // --- PHYSICS ---
  'newton laws of motion': {
    topicTitle: "Newton's Laws of Motion & Momentum Physics",
    subjectName: 'Physics',
    curiosityHook: 'Why does a passenger sitting in a Dala-dala in Dar es Salaam lurch forward when the driver slams the brakes? The answer lies in Sir Isaac Newton’s 1687 discovery of Inertia!',
    deepOverview: `Classical mechanics relies on Newton’s Three Laws of Motion. These fundamental principles explain how forces interact with mass to cause acceleration, velocity changes, and momentum transfer across the universe.

Force is not required to keep an object moving in deep space; force is only required to CHANGE an object's velocity (magnitude or direction). Newton redefined motion by proving that acceleration is directly proportional to the applied net force and inversely proportional to object mass (F = ma). Furthermore, forces never occur in isolation—they always exist as equal and opposite action-reaction pairs between two distinct objects.`,
    corePrinciples: [
      { title: 'First Law (Law of Inertia)', detail: 'Every body continues in its state of rest or uniform motion in a straight line unless acted upon by a net external resultant force.' },
      { title: 'Second Law (F = dp/dt)', detail: 'The rate of change of momentum of a body is directly proportional to the applied force and takes place in the direction of the force. F = m × a.' },
      { title: 'Third Law (Action-Reaction)', detail: 'For every action force exerted by body A on body B, body B exerts an equal magnitude force in the opposite direction on body A.' },
      { title: 'Conservation of Linear Momentum', detail: 'In a closed system with no external forces, Total Momentum Before Collision = Total Momentum After Collision (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂).' }
    ],
    realWorldTanzaniaConnection: 'Space rockets launched from the equator, or the recoil felt when a Tanzania Wildlife Authority ranger fires a patrol rifle, directly demonstrate Newton’s 3rd Law: hot gas pushed backward propels the rocket forward!',
    workedExamples: [
      {
        problem: 'A 1200 kg car accelerates from rest to 20 m/s in 5 seconds. Calculate the net engine force required.',
        solution: 'Step 1: Calculate acceleration a = (v - u) / t = (20 - 0) / 5 = 4 m/s².\nStep 2: Apply Newton’s Second Law: F = m × a = 1200 kg × 4 m/s² = 4800 N.',
        keyTakeaway: 'Force is measured in Newtons (N), where 1 N = 1 kg·m/s².'
      }
    ],
    probingQuestions: [
      'If you jump out of a boat onto a wooden pier in Lake Tanganyika, why does the boat push away from the shore?',
      'Why do modern car bumpers crumple upon impact? (Hint: Think about how extending collision time "t" reduces the force "F = Δp / t"!).'
    ],
    nectaExamTips: [
      'In NECTA Form 1 & Form 2 Physics examinations, always state the units (Newtons, kg·m/s, m/s²) for every calculated answer.',
      'Remember: Action and Reaction forces act on TWO DIFFERENT objects, so they never cancel each other out on a single object body diagram.'
    ],
    bilingualSwahiliNote: {
      heading: 'Kanuni Tatu za Mwendo za Newton (Physics)',
      overview: 'Kanuni za Newton zinaeleza jinsi kani (force) na uzito (mass) vinavyoamua kasi na mwendo wa vitu. Hii ndiyo msingi wa uhandisi wa magari, ndege, na roketi.',
      keyPoints: [
        'Kanuni ya 1: Inotia (Inertia) - Kitu kinakataa kubadilisha hali yake ya mwendo au kutulia.',
        'Kanuni ya 2: F = ma - Kani ni sawa na Masi mara Mchapuko.',
        'Kanuni ya 3: Kila kitendo (Action) kina kitendo-pingamizi (Reaction) sawa kwa ukubwa lakini upande tofauti.'
      ]
    }
  },

  // --- BIOLOGY ---
  'cell structure': {
    topicTitle: 'Cell Biology, Microscopic Organelles & Cellular Respiration',
    subjectName: 'Biology',
    curiosityHook: 'Did you know your human body contains over 37 TRILLION microscopic biological cells, each operating like a tiny self-sustaining city with its own power plants, post offices, and security gates?',
    deepOverview: `Cells are the fundamental units of structure, function, and organization in all living organisms, from single-celled amoebas to giant Baobab trees in Ruaha National Park.

Inside every eukaryotic cell, specialized membrane-bound structures called organelles carry out biochemical tasks. The nucleus holds the organism's DNA genetic code; mitochondria perform aerobic respiration converting glucose into ATP bio-energy currency; ribosomes assemble proteins; and the endoplasmic reticulum & Golgi apparatus package and transport molecular cargo. Plant cells differ from animal cells by possessing a rigid cellulose cell wall, large sap vacuoles for turgor pressure, and chloroplasts containing chlorophyll pigments that capture sunlight energy to drive photosynthesis.`,
    corePrinciples: [
      { title: 'Cell Theory', detail: '1) All living organisms are composed of one or more cells. 2) The cell is the basic unit of life. 3) All cells arise from pre-existing cells.' },
      { title: 'Organelle Specialization', detail: 'Nucleus (DNA control), Mitochondria (ATP respiration), Chloroplast (Photosynthesis), Ribosomes (Protein synthesis).' },
      { title: 'Plant vs Animal Adaptations', detail: 'Plant cells have rigid cell walls and chloroplasts; animal cells have flexible cell membranes and centrioles for division.' },
      { title: 'Selective Permeability', detail: 'The phospholipid bilayer controls passage of water, ions, and nutrients via diffusion, osmosis, and active transport.' }
    ],
    realWorldTanzaniaConnection: 'Cinchona tree bark harvested in Lushoto contains quinine that targets the cell membrane and mitochondria of Plasmodium parasites inside human red blood cells, curing malaria!',
    workedExamples: [
      {
        problem: 'Calculate the actual size of a plant cell if its image under a compound light microscope at x400 magnification is 20 mm.',
        solution: 'Formula: Actual Size = Image Size / Magnification.\nActual Size = 20 mm / 400 = 0.05 mm = 50 micrometers (µm).',
        keyTakeaway: 'Always convert millimeters to micrometers (1 mm = 1000 µm) for cell dimensions!'
      }
    ],
    probingQuestions: [
      'Why can a plant cell survive in pure freshwater without bursting, while a human red blood cell under the same conditions undergoes osmotic lysis (bursting)?',
      'What would happen to life on Earth if mitochondria suddenly lost the ability to perform electron transport chain respiration?'
    ],
    nectaExamTips: [
      'In NECTA Biology practicals, when drawing a plant or animal cell, use clean continuous pencil lines (no shading or sketching) and label with horizontal guide lines that do not cross.'
    ],
    bilingualSwahiliNote: {
      heading: 'Elimu ya Seli za Viumbe Hai (Cell Biology)',
      overview: 'Seli ndicho kizio cha msingi cha uhai. Seli za mimea zina ukuta mgumu (Cell Wall) na Viwanda vya Chakula (Chloroplasts), wakati seli za wanyama zina utando laini (Cell Membrane).',
      keyPoints: [
        'Nuklia (Nucleus): Kituo Kikuu cha Utawala cha Seli.',
        'Maitokondria (Mitochondria): Kituo cha Kufua Nishati (ATP).',
        'Kloroplasti (Chloroplasts): Hutengeneza chakula kwa kutumia mwanga wa jua.'
      ]
    }
  },

  // --- CHEMISTRY ---
  'periodic table trends': {
    topicTitle: 'The Periodic Table, Electronic Configurations & Chemical Bonding',
    subjectName: 'Chemistry',
    curiosityHook: 'Tanzanite—found ONLY in a small 4km strip near Mererani, Tanzania—owes its hypnotic trichroic violet-blue color to trace amounts of Vanadium transition metal elements sitting in Group 5 of the Periodic Table!',
    deepOverview: `Dmitri Mendeleev arranged elements by atomic number to reveal periodic trends in chemical reactivity, electronegativity, atomic radius, and ionization energy.

An element's position on the Periodic Table is dictated by its valence electron shell configuration. Group numbers (1 to 8/18) correspond to the number of electrons in the outermost shell, determining chemical bonding behavior. Period numbers (1 to 7) indicate the total number of occupied electron shells. Alkali metals in Group 1 readily lose 1 electron to form +1 cations, reacting violently with water, while Halogens in Group 7 readily gain 1 electron to form -1 anions.`,
    corePrinciples: [
      { title: 'Atomic Number (Z) vs Mass Number (A)', detail: 'Z is the number of protons in the nucleus (defines element identity). A is protons + neutrons.' },
      { title: 'Periodic Trends Across a Period (Left to Right)', detail: 'Atomic radius decreases, nuclear charge increases, electronegativity and ionization energy increase.' },
      { title: 'Group Trends Down a Group (Top to Bottom)', detail: 'Atomic radius increases, shielding effect increases, metallic reactivity increases in metals but decreases in non-metals.' },
      { title: 'Types of Chemical Bonds', detail: 'Ionic bonding (electrostatic transfer between metals & non-metals), Covalent bonding (electron pair sharing between non-metals), Metallic bonding.' }
    ],
    realWorldTanzaniaConnection: 'Geita Gold Mine extracts Gold (Au, Group 11), using sodium cyanide leaching based on oxidation states and chemical coordination complexes.',
    workedExamples: [
      {
        problem: 'Determine the group, period, and ion charge for Sodium (Na) with atomic number Z = 11.',
        solution: 'Step 1: Write electron configuration: 2, 8, 1.\nStep 2: 3 electron shells → Period 3.\nStep 3: 1 outer electron → Group I.\nStep 4: Tends to lose 1 electron → Forms Na⁺ cation.',
        keyTakeaway: 'Valence electrons determine group position and ionic charge!'
      }
    ],
    probingQuestions: [
      'Why are Noble Gases (Group 0/VIII) chemically inert and unreactive in nature?',
      'Why does Potassium (K) react much more explosively with water than Lithium (Li)?'
    ],
    nectaExamTips: [
      'NECTA Chemistry examiners penalize students who confuse "Atomic Mass" with "Atomic Number". Always double-check atomic numbers when writing electronic structures (2, 8, 8, 2).'
    ],
    bilingualSwahiliNote: {
      heading: 'Mfumo wa Nyakati za Elementi (Periodic Table)',
      overview: 'Elementi zote za kemikali zimepangwa kwa mfuatano wa namba zao za atomi. Mstari wa wima (Group) unaonyesha elektroni za nje, na mstari wa mlalo (Period) unaonyesha idadi ya maganda ya elektroni.',
      keyPoints: [
        'Kundi la 1 (Alkali Metals): Zina elektroni 1 nje, zinahitaji kupoteza elektroni hiyo.',
        'Kundi la 7 (Halogens): Zina elektroni 7 nje, zinahitaji kupata elektroni 1.',
        'Kundi la 8 (Noble Gases): Zimekamilika, hazijichanganyi na elementi zingine.'
      ]
    }
  },

  // --- GEOGRAPHY & HISTORY ---
  'the solar system': {
    topicTitle: 'Astronomy, Plate Tectonics & The Great East African Rift Valley',
    subjectName: 'Geography',
    curiosityHook: 'The East African Rift Valley stretching through Tanzania from Lake Natron to Lake Nyasa is literally splitting the African continent into two tectonic plates—in 10 million years, East Africa will become a brand-new island ocean continent!',
    deepOverview: `Geography bridges planetary space science with Earth’s dynamic geological forces. The Solar System consists of the Sun—a G-type main-sequence star—and eight orbiting planets classified into inner rocky terrestrial planets (Mercury, Venus, Earth, Mars) and outer giant gas planets (Jupiter, Saturn, Uranus, Neptune).

On Earth, internal heat engines drive mantle convection currents that move tectonic plates. Divergent plate boundaries pull crust apart, creating continental rift valleys, shield volcanoes like Mount Ol Doinyo Lengai (the world's only active carbonatite volcano), and deep crater lakes.`,
    corePrinciples: [
      { title: 'Earth Rotation vs Revolution', detail: 'Rotation on axis (24 hours) causes Day/Night and Coriolis effect. Revolution around Sun (365.25 days) causes Seasons and solstices.' },
      { title: 'Plate Tectonic Boundaries', detail: 'Divergent (pulling apart -> rifts), Convergent (colliding -> mountains), Transform (sliding past -> earthquakes).' },
      { title: 'Rift Valley Formation Mechanism', detail: 'Tensional forces pull continental crust apart; fault lines develop; central land block subsides to form a Graben valley.' }
    ],
    realWorldTanzaniaConnection: 'Ngorongoro Crater—the world’s largest intact caldera—was formed 2.5 million years ago when a massive volcano higher than Mount Kilimanjaro collapsed inward after a tectonic eruption!',
    workedExamples: [
      {
        problem: 'If local time in Dar es Salaam (40°E) is 3:00 PM, what is the local solar time in Accra, Ghana (0° Prime Meridian)?',
        solution: 'Step 1: Calculate longitude difference: 40° - 0° = 40°.\nStep 2: Convert to time (15° = 1 hour): 40 / 15 = 2 hours and 40 minutes.\nStep 3: Accra is West of Dar es Salaam, so subtract time: 3:00 PM - 2 hrs 40 mins = 12:20 PM.',
        keyTakeaway: 'Remember: "East Gain, West Lose" (E.G.W.L) when calculating world clock longitudinal times!'
      }
    ],
    probingQuestions: [
      'Why is Ol Doinyo Lengai volcano in Arusha unique in the entire solar system for producing black, cold lava at only 500°C?',
      'How does Earth’s axial tilt of 23.5 degrees create contrasting wet and dry seasons across Tanzania?'
    ],
    nectaExamTips: [
      'When calculating time from longitudes in NECTA Geography Form 1 & Form 2 examinations, always show the division step: (Difference in degrees ÷ 15) = Hours.'
    ],
    bilingualSwahiliNote: {
      heading: 'Mfumo wa Jua na Bonde la Ufa la Afrika Mashariki',
      overview: 'Dunia inazunguka Jua ikileta majira ya mwaka (Seasons). Chini ya ardhi ya Tanzania, nguvu za kijiologia zinasukuma sahani za dunia na kutengeneza Bonde Kuu la Ufa na Milima kama Kilimanjaro.',
      keyPoints: [
        'Mzunguko wa Siku (Rotation): Huleta Usiku na Mchana (Masaa 24).',
        'Mzunguko wa Mwaka (Revolution): Huleta Majira ya Mwaka (Siku 365.25).',
        'Bonde la Ufa: Lilitokana na kani za mvutano (Tensional forces) zilizovuta ardhi pande mbili.'
      ]
    }
  }
};

/**
 * Fallback generator for topics not explicitly pre-populated in the custom detailed map
 */
export function getDeepLessonNote(subjectName: string, topicTitle: string, gradeLevel: string = 'Form 4'): DeepLessonNote {
  const normalizedKey = topicTitle.toLowerCase().trim();
  
  if (DEEP_TOPICS_DATABASE[normalizedKey]) {
    return DEEP_TOPICS_DATABASE[normalizedKey];
  }

  // Find partial match
  for (const key of Object.keys(DEEP_TOPICS_DATABASE)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return DEEP_TOPICS_DATABASE[key];
    }
  }

  // High-quality detailed fallback generator
  return {
    topicTitle: topicTitle,
    subjectName: subjectName,
    curiosityHook: `Did you know that mastering ${topicTitle} unlocks deep insights into how ${subjectName} governs natural phenomena, industrial engineering, and everyday life across Tanzania?`,
    deepOverview: `The topic of **${topicTitle}** is a pivotal component of the ${gradeLevel} ${subjectName} national curriculum in Tanzania. It lays down essential analytical frameworks, conceptual models, and critical problem-solving skills required for both academic excellence in NECTA examinations and practical career applications.

In this deep module, we explore the fundamental mechanisms, mathematical or structural formulations, and real-world implications of ${topicTitle}. By connecting abstract theory to visible, tangible phenomena, students develop higher-order critical thinking and long-term memory retention.`,
    corePrinciples: [
      { title: `1. Core Definition & Scope of ${topicTitle}`, detail: `Understanding the primary terminology, variables, and boundaries that define ${topicTitle} in standard academic literature.` },
      { title: '2. Underlying Mathematical & Conceptual Laws', detail: 'Examining the key equations, logical relationships, or structural classifications that govern this subject domain.' },
      { title: '3. Empirical Evidence & Experimental Validation', detail: 'How scientists, historians, or linguists test hypotheses and prove theories within this field.' },
      { title: '4. Critical Analysis & Problem Solving', detail: 'Applying step-by-step logical deduction to solve multi-step problems and answer NECTA exam scenarios.' }
    ],
    realWorldTanzaniaConnection: `In Tanzania, concepts from ${topicTitle} are actively applied in national development projects—ranging from agriculture and environmental preservation in the Southern Highlands to engineering, mining, and cultural heritage conservation in Dar es Salaam, Arusha, and Mwanza.`,
    workedExamples: [
      {
        problem: `Explain the step-by-step procedure to analyze a standard NECTA question on ${topicTitle}.`,
        solution: `1. Identify the given parameters and required target values.\n2. State the relevant law, formula, or rule governing ${topicTitle}.\n3. Substitute values carefully with appropriate standard units.\n4. Verify the final answer for logical consistency and sign correctness.`,
        keyTakeaway: 'Structured step-by-step presentation earns maximum marks in NECTA national marking schemes!'
      }
    ],
    probingQuestions: [
      `How would the principles of ${topicTitle} change if tested under extreme environmental conditions or in a different historical era?`,
      `What is the biggest common misconception students have when studying ${topicTitle}, and how can you avoid it?`,
      `How can you teach the core idea of ${topicTitle} to a Primary Grade 1 student using a simple story or analogy?`
    ],
    nectaExamTips: [
      `Always read NECTA exam instructions carefully; underline key command words like 'Define', 'Explain', 'Calculate', or 'Differentiate'.`,
      `Include labeled diagrams or clearly structured headings whenever answering essay or structured paper questions on ${topicTitle}.`
    ],
    bilingualSwahiliNote: {
      heading: `Maelezo ya Kina kwa Kiswahili: ${topicTitle}`,
      overview: `Mada hii ya **${topicTitle}** katika somo la **${subjectName}** ni sehemu muhimu sana ya mtaala wa Tanzania. Inamsaidia mwanafunzi kuelewa dhana kuu, kanuni za kisayansi au kisarufi, na namna ya kujibu maswali ya mitihani ya kitaifa (NECTA) kwa ufasaha.`,
      keyPoints: [
        `Kuelewa misingi na istilahi kuu za ${topicTitle}.`,
        `Kutumia mifano ya maisha ya kila siku nchini Tanzania ili kuimarisha kumbukumbu.`,
        `Kufuata mbinu sahihi za ujibu wa maswali ya NECTA ili kupata alama za juu.`
      ]
    }
  };
}
