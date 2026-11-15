// NASA Space Science Data Coordinated Archive (NSSDCA) Official Verified Data
// Theme: "Abandoned but Not Forgotten" - Official NASA Challenge Prompt Catalog

export const CELESTIAL_BODIES = {
  earth: {
    id: 'earth',
    name: 'EARTH',
    subtitle: 'THE ORIGIN // CRADLE OF CIVILIZATION',
    tag: 'ORIGIN_01',
    distance: '0.000 KM',
    radius: '6,371 KM',
    atmosphere: 'N2: 78%, O2: 21%, Ar: 0.9%',
    description:
      'The lone oasis of terrestrial life and the launching pad of human ambition. From low Earth orbit to the deep expanse, every journey into the void begins here. Before we step onto other worlds, we look back at the pale blue dot—fragile, solitary, and bound together by the drive to explore.',
    monumentsCount: '5,000+ Active/Decommissioned Orbiters',
    coordinates: '00°00\'00"N 00°00\'00"E'
  },
  moon: {
    id: 'moon',
    name: 'MOON',
    subtitle: 'THE HERITAGE // SEEDS OF EXPLORATION',
    tag: 'HERITAGE_02',
    distance: '384,400 KM',
    radius: '1,737.4 KM',
    atmosphere: 'Trace exosphere (He, Ne, H2)',
    description:
      'Earth\'s eternal companion holds humanity\'s inaugural extraterrestrial artifacts. What critics once dismissed as discarded aluminum and titanium are now preserved time-capsules of 20th-century courage. In the airless lunar silence, descent stages, roving buggies, and science stations remain exactly as left—pristine monuments waiting for humanity\'s return.',
    monumentsCount: '4 Catalogued Sites',
    coordinates: 'Tranquility Base // Hadley // Oceanus Procellarum'
  },
  mars: {
    id: 'mars',
    name: 'MARS',
    subtitle: 'THE FRONTIER // SILENT GUARDIANS',
    tag: 'FRONTIER_03',
    distance: '225,000,000 KM (AVG)',
    radius: '3,389.5 KM',
    atmosphere: 'CO2: 95.3%, N2: 2.6%, Ar: 1.9%',
    description:
      'The Red Planet and deep space are a cemetery of triumphs. Robotic emissaries have braved interplanetary transit, dust storms, and atmospheric entry. From tiny rovers to deep-space observatories, these machines became humanity’s sensory organs on alien ground—standing silent watch over rust-red dunes until the first astronauts arrive.',
    monumentsCount: '9 Catalogued Sites',
    coordinates: 'Ares Vallis // Meridiani // Jezero // Deep Space'
  },
  models: {
    id: 'models',
    name: '3D MODELS',
    subtitle: 'INTERACTIVE CELESTIAL & ARTIFACT REPOSITORY',
    tag: 'EXPLORER_04',
    distance: '3D DIGITAL LAB',
    radius: 'ORBITAL SIMULATION',
    atmosphere: 'REAL-TIME GLTF SHADERS',
    description:
      'Interactive 3D digital laboratory featuring photorealistic digital twins of Earth, the Moon, and Mars. Manipulate celestial geometry with cursor drag-and-tilt, inspect orbital telemetry, and examine archaeological artifacts with 360° interactive rotation.',
    monumentsCount: '3 Celestial Bodies & 13 Sites',
    coordinates: 'Real-Time 3D Viewport'
  },
  archive: {
    id: 'models',
    name: '3D MODELS',
    subtitle: 'INTERACTIVE CELESTIAL & ARTIFACT REPOSITORY',
    tag: 'EXPLORER_04',
    distance: '3D DIGITAL LAB',
    radius: 'ORBITAL SIMULATION',
    atmosphere: 'REAL-TIME GLTF SHADERS',
    description:
      'Interactive 3D digital laboratory featuring photorealistic digital twins of Earth, the Moon, and Mars. Manipulate celestial geometry with cursor drag-and-tilt, inspect orbital telemetry, and examine archaeological artifacts with 360° interactive rotation.',
    monumentsCount: '3 Celestial Bodies & 13 Sites',
    coordinates: 'Real-Time 3D Viewport'
  }
};

export const CELESTIAL_MODELS_DATA = [
  {
    id: 'earth',
    name: 'EARTH DIGITAL TWIN',
    tag: 'TERRESTRIAL SPHERE // 01',
    format: 'GLTF 2.0 Binary (.glb)',
    filesize: '12.9 MB',
    scale: '1:1,000,000',
    polygons: '32,400 Triangles',
    textures: '4K PBR Diffuse / Normal / Specular',
    features: [
      'Atmospheric Rayleigh Scattering Rim Shader',
      'High-Definition Continental Topography',
      'Dynamic Day/Night Lighting Contrast',
      'Real-Time Cursor Parallax Tilt Response'
    ],
    diameter: '12,742 KM',
    orbitSpeed: '107,200 KM/H',
    atmosphere: 'Nitrogen 78% / Oxygen 21% / Argon 0.9%',
    nasaSource: 'NASA Earth Observatory / Blue Marble Next Generation',
    modelPath: '/earth.glb',
    color: '#3b82f6',
    sitesTarget: 'earth'
  },
  {
    id: 'moon',
    name: 'LUNAR SURFACE TWIN',
    tag: 'LUNAR CRATER RELIEF // 02',
    format: 'GLTF 2.0 Binary (.glb)',
    filesize: '3.3 MB',
    scale: '1:1,000,000',
    polygons: '24,800 Triangles',
    textures: '4K Lunar Reconnaissance Orbiter (LRO) DEM',
    features: [
      'Photorealistic Impact Basin Micro-Relief',
      '4 Official NASA Challenge Landing Sites',
      'Apollo 11, 15, 17 & Surveyor III Hotspot Anchors',
      'Inertial Damping Drag-to-Rotate 360°'
    ],
    diameter: '3,474.8 KM',
    orbitSpeed: '3,683 KM/H',
    atmosphere: 'Trace Exosphere (Helium, Neon, Hydrogen)',
    nasaSource: 'NASA Lunar Reconnaissance Orbiter (LRO) LOLA Data',
    modelPath: '/moon.glb',
    color: '#e2e8f0',
    sitesTarget: 'moon'
  },
  {
    id: 'mars',
    name: 'MARTIAN CRUST TWIN',
    tag: 'RED PLANET TOPOGRAPHY // 03',
    format: 'GLTF 2.0 Binary (.glb)',
    filesize: '4.0 MB',
    scale: '1:1,000,000',
    polygons: '28,600 Triangles',
    textures: '4K Mars Global Surveyor MOLA Altimetry',
    features: [
      'Iron-Oxide Regolith Mineral Textures',
      '9 Official NASA Challenge Landing Sites',
      'Perseverance, Curiosity, InSight & Viking 1 Anchors',
      'Atmospheric Dust Haze Scattering Glow'
    ],
    diameter: '6,779 KM',
    orbitSpeed: '86,677 KM/H',
    atmosphere: 'CO2 95.3% / Nitrogen 2.6% / Argon 1.9%',
    nasaSource: 'NASA Mars Odyssey THEMIS & MGS MOLA Database',
    modelPath: '/mars.glb',
    color: '#f97316',
    sitesTarget: 'mars'
  },
  {
    id: 'apollo',
    name: 'APOLLO LUNAR MODULE',
    tag: 'CREWED LUNAR LANDER // 04',
    format: 'GLTF 2.0 Binary (.glb)',
    filesize: '700 KB',
    scale: '1:1 Scale Spacecraft Asset',
    polygons: '35,600 Triangles',
    textures: 'PBR Thermal Gold Foil & Mylar Metalness',
    features: [
      'Grumman Descent & Ascent Stage Geometry',
      'Deployable Lunar Surface Sensing Probes',
      'High-Gain S-Band Steerable Antenna Dish',
      'Tranquility Base Regolith Landing Footpads'
    ],
    diameter: '9.45 M (Leg Span)',
    orbitSpeed: 'Lunar Surface Landing (0 KM/H)',
    atmosphere: 'Tranquility Base (Lunar Vacuum)',
    nasaSource: 'NASA / Michael D. Carbajal',
    creditLine: 'Credit: NASA / Michael D. Carbajal',
    license: 'Public Domain / Free for Educational & Informational Use (NASA Guidelines)',
    modelPath: '/apollo-lunar-module.glb',
    color: '#f59e0b',
    sitesTarget: 'moon'
  },
  {
    id: 'pioneer',
    name: 'PIONEER 10 SPACECRAFT',
    tag: 'DEEP SPACE EXPLORER // 05',
    format: 'GLTF 2.0 Binary (.glb)',
    filesize: '1.95 MB',
    scale: '1:1 Scale Spacecraft Asset',
    polygons: '22,400 Triangles',
    textures: 'PBR Parabolic Dish & SNAP-19 RTG Elements',
    features: [
      '2.74-meter High-Gain Parabolic Reflector Dish',
      'Dual SNAP-19 Radioisotope Thermoelectric Generators',
      'Magnetometer Boom & Cosmic Ray Sensor Suite',
      'Carl Sagan Golden Interstellar Message Plaque'
    ],
    diameter: '2.74 M (Dish Diameter)',
    orbitSpeed: '43,000 KM/H (Interstellar Escape)',
    atmosphere: 'Interstellar Vacuum (Beyond Heliopause)',
    nasaSource: 'NASA / JPL / Eyes on the Solar System',
    creditLine: 'Credit: NASA / JPL / Eyes on the Solar System',
    license: 'Public Domain / Free for Educational & Informational Use (NASA Guidelines)',
    modelPath: '/pioneer-10.glb',
    color: '#6366f1',
    sitesTarget: 'mars'
  }
];

export const HOTSPOTS_DATA = {
  moon: [
    {
      id: 'apollo-lms',
      modelId: 'apollo',
      title: 'Apollo Lunar Modules',
      targetName: 'Apollo Lunar Modules',
      shortLabel: 'Apollo LM',
      badgeTag: 'CREWED DESCENT STAGES',
      agency: 'NASA / Grumman Aerospace',
      color: '#f59e0b',
      codename: 'EAGLE & APOLLO DESCENT STAGES',
      mission: 'Apollo Program (11–17) // NASA',
      date: '1969 – 1972',
      site: 'Tranquility Base & Lunar Landing Sites',
      coords: '0.674° N, 23.473° E (Apollo 11 Base)',
      position: [1.35, 0.5, 1.5],
      summary:
        'The descent stages of the Lunar Modules (like Apollo 11\'s Eagle) were left behind as launch pads when astronauts departed, standing as humanity\'s first archaeological monuments on another world.',
      answers: {
        what: 'The lower half of NASA\'s Apollo Lunar Modules built by Grumman, housing throttleable descent engines, landing legs, and Early Apollo surface experiment stowage.',
        why: 'Intentionally left behind as launch pads. The ascent stage ignited its rocket using the descent stage as a launch platform, shedding deadweight to return astronauts to the Command Module.',
        achieved: 'Enabled 12 humans to walk on the lunar surface between 1969 and 1972, supporting lunar EVAs, gathering 382 kg of prime geological samples, and pioneering lunar exploration.',
        where: 'Six descent stages rest intact across lunar landing sites: Apollo 11 (Tranquility Base), Apollo 12, 14, 15, 16, and 17.',
        matters: 'Designated as historic heritage under the Artemis Accords §5.4, requiring international exclusion buffers to protect their thermal gold foil and commemorative plaques from rocket plume erosion.'
      }
    },
    {
      id: 'lunar-roving-vehicles',
      title: 'Lunar Roving Vehicles (LRVs)',
      targetName: 'Lunar Roving Vehicles',
      shortLabel: 'Lunar Rover',
      badgeTag: 'CREWED ELECTRIC BUGGIES',
      agency: 'NASA / Boeing / Delco',
      color: '#38bdf8',
      codename: 'LRV 001, 002, 003',
      mission: 'Apollo 15, 16, 17 // NASA',
      date: '1971 – 1972',
      site: 'Hadley, Descartes & Taurus-Littrow',
      coords: '26.132° N, 3.634° E (Hadley Rille)',
      position: [-1.5, 0.85, 1.2],
      summary:
        'Three electric "moon buggies" driven by Apollo astronauts. Parked permanently on the Moon with their color television cameras aimed upward to record lunar module liftoffs.',
      answers: {
        what: 'Four-wheeled electric crewed roving vehicles developed by Boeing and Delco with woven zinc-coated wire mesh tires, titanium chevron treads, and joystick control.',
        why: 'Weighing 210 kg, the rovers exceeded the return lift capacity of the Lunar Module ascent stages. Leaving them behind allowed astronauts to bring home 77+ kg of rare lunar bedrock instead.',
        achieved: 'Transformed lunar exploration from localized footprints into wide planetary field expeditions, traversing over 90 cumulative kilometers and retrieving the 4-billion-year-old Genesis Rock.',
        where: 'Three buggies remain parked in pristine lunar vacuum: Hadley-Apennine (Apollo 15), Descartes Highlands (Apollo 16), and Taurus-Littrow Valley (Apollo 17).',
        matters: 'The pioneering benchmark for extraterrestrial mobility, directly informing the engineering architecture for NASA\'s upcoming Artemis Lunar Terrain Vehicle (LTV).'
      }
    },
    {
      id: 'alsep-packages',
      title: 'ALSEP Scientific Packages',
      targetName: 'ALSEP Packages',
      shortLabel: 'ALSEP',
      badgeTag: 'SURFACE SCIENCE STATIONS',
      agency: 'NASA / Bendix Aerospace',
      color: '#10b981',
      codename: 'APOLLO LUNAR EXPERIMENTS',
      mission: 'Apollo Program // NASA Bendix',
      date: '1969 – 1977',
      site: 'Multiple Lunar Landing Basins',
      coords: '3.012° S, 23.422° W (Apollo 12 ALSEP)',
      position: [0.7, -1.85, 0.75],
      summary:
        'Apollo Lunar Surface Experiments Packages (seismometers, retroreflectors, etc.) left by astronauts to continuously monitor moonquakes, solar wind, and lunar heat flow long after departure.',
      answers: {
        what: 'Modular suites of geophysical science stations powered by SNAP-27 plutonium radioisotope thermoelectric generators, carrying seismometers, retroreflector arrays, and suprathermal ion detectors.',
        why: 'Engineered for multi-year unattended planetary observation to monitor lunar internal activity and solar wind interactions over seasonal diurnal cycles.',
        achieved: 'Detected over 10,000 deep and shallow moonquakes, measured internal heat dissipation, and provided the first conclusive proof that the Moon possesses a small partially molten metallic core.',
        where: 'Five ALSEP stations stand on the Moon. While transmitters were retired in September 1977, their passive Corner Cube Laser Retroreflectors remain operational and targeted by Earth lasers today.',
        matters: 'Laser retroreflectors in ALSEP arrays still measure the Earth-Moon distance to millimeter accuracy, confirming the Moon spirals away by 3.8 cm annually and verifying general relativity.'
      }
    },
    {
      id: 'surveyor-landers',
      title: 'Surveyor Landers',
      targetName: 'Surveyor Landers',
      shortLabel: 'Surveyor',
      badgeTag: 'ROBOTIC RECONNAISSANCE',
      agency: 'NASA / JPL / Hughes Aircraft',
      color: '#34d399',
      codename: 'SURVEYOR 1 THROUGH 7',
      mission: 'Surveyor Program // NASA JPL',
      date: '1966 – 1968',
      site: 'Ocean of Storms & Lunar Basins',
      coords: '3.016° S, 23.418° W (Surveyor 3)',
      position: [0.4, -1.3, 1.6],
      summary:
        'Robotic probes sent in the 1960s to prove soft landings were possible and verify that lunar regolith was solid ground capable of supporting heavy crewed Apollo spacecraft.',
      answers: {
        what: 'Three-legged uncrewed robotic landers built by Hughes Aircraft equipped with steerable television cameras, surface trenching scoops, radar altimeters, and alpha-scattering spectrometers.',
        why: 'Precursor reconnaissance technology demonstrators designed for one-way missions. Their chemical batteries and instruments froze during the deep -170°C two-week lunar night.',
        achieved: 'Achieved the first American automated soft landings on another celestial world, dug mechanical soil trenches, and disproved the catastrophic theory that the Moon was covered in quicksand-like dust.',
        where: 'Five successful landers remain on the lunar surface. In 1969, Apollo 12 executed a pinpoint landing 160 meters from Surveyor 3; astronauts walked over and retrieved its camera and scoop for return to Earth.',
        matters: 'The components retrieved from Surveyor 3 provided humanity\'s only empirical data on how terrestrial materials, optical glass, and microbes survive years of unfiltered cosmic radiation and lunar thermal cycling.'
      }
    }
  ],
  mars: [
    {
      id: 'sojourner-rover',
      title: 'Sojourner Rover',
      targetName: 'Sojourner',
      shortLabel: 'Sojourner',
      badgeTag: 'FIRST MARS ROVER (1997)',
      agency: 'NASA / JPL',
      color: '#f97316',
      codename: 'MICROROVER // PATHFINDER',
      mission: 'Mars Pathfinder // NASA JPL',
      date: 'July 4, 1997 | Retired Sept 27, 1997',
      site: 'Ares Vallis (Carl Sagan Station)',
      coords: '19.33° N, 33.55° W',
      position: [-1.4, 0.45, 1.3],
      summary:
        'The first rover on Mars (1997), delivered by the Pathfinder lander. Now permanently parked in Ares Vallis after proving wheeled autonomous mobility on an alien world.',
      answers: {
        what: 'A 10.5 kg six-wheeled microrover equipped with an Alpha Particle X-ray Spectrometer (APXS), forward stereo cameras, and solar power array.',
        why: 'Designed as a 7-sol demonstration mission; operated for 83 sols until the Pathfinder base station transmitter battery failed, breaking the communications link back to Earth.',
        achieved: 'Traversed 100 meters, captured 550 photographs, analyzed the elemental composition of Martian rocks ("Yogi", "Barnacle Bill"), and confirmed Ares Vallis was an ancient outflow channel.',
        where: 'Permanently parked adjacent to the Pathfinder lander at the Carl Sagan Memorial Station in Ares Vallis.',
        matters: 'Pioneered the patented rocker-bogie mobility suspension and hazard-avoidance algorithms adopted by Spirit, Opportunity, Curiosity, and Perseverance.'
      }
    },
    {
      id: 'spirit-opportunity',
      title: 'Spirit & Opportunity',
      targetName: 'Spirit & Opportunity',
      shortLabel: 'Spirit & Oppy',
      badgeTag: 'TWIN ROBOTIC GEOLOGISTS',
      agency: 'NASA / JPL-Caltech',
      color: '#a855f7',
      codename: 'MER-A (SPIRIT) & MER-B (OPPY)',
      mission: 'Mars Exploration Rover // NASA JPL',
      date: 'Jan 2004 | Retired 2010 & 2019',
      site: 'Gusev Crater & Meridiani Planum',
      coords: '14.57° S, 175.48° E & 1.95° S, 354.47° E',
      position: [0.45, -1.2, 1.45],
      summary:
        'Twin rovers that operated for years beyond their 90-sol warranties. Both are now inactive monuments to Mars exploration, having discovered hematite spheres proving ancient liquid water.',
      answers: {
        what: 'Twin solar-powered robotic geologists carrying microscopic imagers, Mössbauer spectrometers, Miniature Thermal Emission Spectrometers, and Rock Abrasion Tools.',
        why: 'Spirit became stuck in soft sand at "Troy" in 2009 and froze over the Martian winter. Opportunity survived for nearly 15 years until a global 2018 dust storm starved its solar panels.',
        achieved: 'Opportunity completed a 45.16 km interplanetary marathon and discovered "blueberries" proving standing acidic lakes; Spirit uncovered 90% pure silica formed by ancient hot spring volcanism.',
        where: 'Spirit rests beside Home Plate in Gusev Crater; Opportunity rests on the upper rim of Endeavour Crater in Perseverance Valley.',
        matters: 'The ultimate symbol of robotic longevity and humanity\'s deep emotional connection to planetary exploration machines.'
      }
    },
    {
      id: 'viking-landers',
      title: 'Viking 1 & 2 Landers',
      targetName: 'Viking 1 & 2',
      shortLabel: 'Viking Landers',
      badgeTag: 'FIRST SUCCESSFUL BASES',
      agency: 'NASA / Langley / JPL',
      color: '#fb923c',
      codename: 'VIKING 1 & 2 SURFACE STATIONS',
      mission: 'Viking Program // NASA',
      date: '1976 | Retired 1980 & 1982',
      site: 'Chryse & Utopia Planitiae',
      coords: '22.48° N, 47.97° W & 48.27° N, 225.99° W',
      position: [-1.5, 0.55, 1.35],
      summary:
        'The first U.S. landers to successfully operate on Mars (1976), remaining exactly where they touched down after transmitting the first panoramic color views and conducting biological soil tests.',
      answers: {
        what: 'Two heavy surface stations powered by dual SNAP-19 radioisotope thermoelectric generators, equipped with facsimile scanning cameras, GCMS analyzers, and meteorology booms.',
        why: 'Stationary long-duration landers. Viking 2 batteries died in 1980; Viking 1 operated for 2,245 sols until a faulty uplink command accidentally commanded the high-gain dish away from Earth in 1982.',
        achieved: 'Transmitted over 50,000 images, performed humanity\'s first direct in-situ life-detection tests, and logged continuous daily Martian atmospheric weather patterns across multiple years.',
        where: 'Viking 1 rests in Chryse Planitia (Thomas Mutch Memorial Station); Viking 2 rests in the frost-strewn plains of Utopia Planitia.',
        matters: 'Established the gold standard for interplanetary engineering reliability and planetary quarantine protocols still honored by NASA and ESA today.'
      }
    },
    {
      id: 'phoenix-insight',
      title: 'Phoenix & InSight Landers',
      targetName: 'Phoenix & InSight',
      shortLabel: 'Phoenix & InSight',
      badgeTag: 'WATER ICE & SEISMOLOGY',
      agency: 'NASA / Univ. of Arizona / CNES',
      color: '#34d399',
      codename: 'NORTH POLAR & SEISMIC BASES',
      mission: 'Mars Scout & Discovery // NASA JPL',
      date: '2008 & 2018 | Retired 2008 & 2022',
      site: 'Vastitas Borealis & Elysium Planitia',
      coords: '68.22° N, 125.75° W & 4.50° N, 135.62° E',
      position: [0.9, -1.4, 1.3],
      summary:
        'Phoenix dug for water ice in the Martian arctic; InSight listened for marsquakes to map the core, mantle, and crust. Both eventually lost power as dust and winter darkness set in.',
      answers: {
        what: 'Specialized robotic surface laboratories: Phoenix carried a robotic trenching arm and wet-chemistry lab; InSight deployed the ultra-sensitive SEIS seismometer under a vacuum wind-and-thermal shield.',
        why: 'Solar-powered landers in dust-prone environments. Phoenix was crushed by heavy winter dry-ice buildup in late 2008; InSight lost battery charging in Dec 2022 after 4 years of dust accumulation.',
        achieved: 'Phoenix scooped pure sub-surface water ice that vaporized in sunlight; InSight mapped internal Martian planetary layers for the first time and recorded 1,319 marsquakes.',
        where: 'Phoenix rests in the northern arctic plains of Vastitas Borealis; InSight stands silently coated in rust dust on the plains of Elysium Planitia.',
        matters: 'Provided the empirical foundation showing water ice is accessible inches below Martian regolith and created the first seismic blueprint of an alien terrestrial planet.'
      }
    },
    {
      id: 'ingenuity-helicopter',
      title: 'Ingenuity Helicopter',
      targetName: 'Ingenuity',
      shortLabel: 'Ingenuity',
      badgeTag: 'FIRST EXTRATERRESTRIAL FLIGHT',
      agency: 'NASA / JPL-Caltech',
      color: '#f43f5e',
      codename: 'GINNY // MARS ROTORCRAFT',
      mission: 'Mars 2020 // NASA JPL',
      date: 'Feb 18, 2021 | Retired Jan 25, 2024',
      site: 'Jezero Crater // Neretva Airfield',
      coords: '18.445° N, 77.451° E',
      position: [1.35, 0.75, 1.4],
      summary:
        'The first aircraft on another planet. Completed 72 historic flights across 17.0 km in Mars\'s ultrathin atmosphere before sustaining rotor blade damage and becoming a stationary artifact.',
      answers: {
        what: 'A 1.8 kg coaxial autonomous rotorcraft with 1.2m carbon-fiber blades spinning at 2,400 RPM to generate lift in an atmosphere with less than 1% of Earth\'s density.',
        why: 'During Flight 72 in January 2024, it experienced navigation dropouts over featureless sand ripples and clipped the surface during touchdown, fracturing rotor blade tips.',
        achieved: 'Proved powered aerodynamic planetary flight. Designed for 5 demonstration flights, it completed 72 flights, covered 17.0 km, flew for 128 minutes, and scouted routes for Perseverance.',
        where: 'Resting on the ripple dunes of Neretva Vallis Airfield in Jezero Crater, its avionics continuing to record daily solar panel health telemetry.',
        matters: 'Pioneered planetary aerial robotics, directly validating the design of NASA\'s Dragonfly nuclear rotorcraft to Titan and future Mars sample-recovery drones.'
      }
    },
    {
      id: 'dawn-spacecraft',
      title: 'Dawn Spacecraft',
      targetName: 'Dawn Spacecraft',
      shortLabel: 'Dawn',
      badgeTag: 'ASTEROID BELT ORBITER',
      agency: 'NASA / JPL / Orbital Sciences',
      color: '#06b6d4',
      codename: 'ION PROPULSION PIONEER',
      mission: 'Discovery Program // NASA JPL',
      date: 'Sept 27, 2007 | Retired Nov 1, 2018',
      site: 'Perpetual Orbit Around Ceres',
      coords: 'Perpetual Unpowered Ceres Orbit (~35 km altitude)',
      position: [-1.25, -0.65, 1.35],
      summary:
        'Mapped giant protoplanet Vesta and dwarf planet Ceres using xenon ion propulsion. Ran out of hydrazine fuel and remains in a perpetual, unpowered stable orbit around Ceres.',
      answers: {
        what: 'A robotic explorer propelled by three NSTAR electrostatic xenon ion thrusters and 65-foot solar arrays, carrying framing cameras and infrared mapping spectrometers.',
        why: 'Exhausted its hydrazine attitude-control propellant in late 2018, rendering it unable to orient its antennas to Earth or keep its solar arrays facing the Sun.',
        achieved: 'The first spacecraft in history to orbit two separate extraterrestrial destinations (Vesta and Ceres), discovering water ice, organics, and brilliant carbonate salt deposits in Occator Crater.',
        where: 'Locked in a perpetual unpowered gravitational orbit around Ceres, calculated to remain stable for at least 50 to 100 years to prevent terrestrial contamination of Ceres.',
        matters: 'Proved the feasibility of deep-space ion propulsion and demonstrated that dwarf planets can harbor ancient subsurface briny oceans and active chemistry.'
      }
    },
    {
      id: 'near-shoemaker',
      title: 'NEAR Shoemaker',
      targetName: 'NEAR Shoemaker',
      shortLabel: 'NEAR Shoemaker',
      badgeTag: 'FIRST ASTEROID LANDER',
      agency: 'NASA / Johns Hopkins APL',
      color: '#eab308',
      codename: 'NEAR // ASTEROID RENDEZVOUS',
      mission: 'Discovery Program // NASA / JHU-APL',
      date: 'Feb 17, 1996 | Landed Feb 12, 2001',
      site: 'Surface of Asteroid 433 Eros',
      coords: 'Himeros Depression, 433 Eros',
      position: [1.1, -1.0, 1.35],
      summary:
        'First spacecraft to orbit and land on an asteroid. Left resting on the boulder-strewn surface of 433 Eros after surviving an improvised 1.9 m/s soft touchdown.',
      answers: {
        what: 'A 805 kg robotic probe designed by Johns Hopkins APL carrying X-ray/gamma-ray spectrometers, a laser rangefinder, and a multispectral CCD imager.',
        why: 'Designed exclusively as an orbital spacecraft without landing legs. Engineers commanded an experimental slow descent at the end of mission, unexpectedly surviving touchdown.',
        achieved: 'Orbited 433 Eros for a full year returning 160,000 images and mineralogical maps, then completed humanity\'s inaugural soft landing on an asteroid on February 12, 2001.',
        where: 'Resting intact inside the Himeros impact depression on the rugged surface of near-Earth asteroid 433 Eros as it orbits between Mars and the inner Solar System.',
        matters: 'Pioneered low-gravity asteroid proximity maneuvers and precision touchdowns, providing the flight heritage for OSIRIS-REx, Hayabusa2, and the DART planetary defense mission.'
      }
    },
    {
      id: 'pioneer-10-11',
      modelId: 'pioneer',
      title: 'Pioneer 10 & 11',
      targetName: 'Pioneer 10 & 11',
      shortLabel: 'Pioneer 10 & 11',
      badgeTag: 'INTERSTELLAR EMBASSADORS',
      agency: 'NASA / Ames Research Center',
      color: '#6366f1',
      codename: 'INTERSTELLAR PROBES',
      mission: 'Pioneer Program // NASA Ames',
      date: '1972 & 1973 | Final Telemetry 2003',
      site: 'Interstellar Space (Beyond Heliopause)',
      coords: 'Outer Heliosheath / Deep Interstellar Space',
      position: [-0.7, 1.45, 1.2],
      summary:
        'Early deep-space probes that explored the outer planets. Carrying Carl Sagan\'s iconic golden pictorial plaques, they are now drifting silently out of the solar system.',
      answers: {
        what: 'Spin-stabilized spacecraft powered by SNAP-19 RTGs with 2.74m parabolic dish antennas, each carrying an engraved gold-anodized aluminum message plaque designed by Carl Sagan.',
        why: 'Radioisotope thermoelectric generators gradually decayed over 30 years until electrical output was insufficient to power transmitters (Pioneer 11 in 1995, Pioneer 10 in 2003).',
        achieved: 'Pioneer 10 was the first spacecraft to navigate the Asteroid Belt and fly by Jupiter; Pioneer 11 achieved the first direct reconnaissance flyby of Saturn and its F ring.',
        where: 'Drifting perpetually into interstellar space: Pioneer 10 heads toward red giant Aldebaran in Taurus; Pioneer 11 heads toward constellation Aquila.',
        matters: 'Humankind\'s first physical ambassadors beyond the heliosphere, bearing timeless pictorial diagrams of humanity and our planetary location for any cosmic discoverer.'
      }
    },
    {
      id: 'kepler-telescope',
      title: 'Kepler Space Telescope',
      targetName: 'Kepler Telescope',
      shortLabel: 'Kepler',
      badgeTag: 'EXOPLANET DISCOVERY PIONEER',
      agency: 'NASA / Ames / Ball Aerospace',
      color: '#ec4899',
      codename: 'KEPLER (DISCOVERY 10)',
      mission: 'Discovery Program // NASA Ames',
      date: 'March 7, 2009 | Retired Oct 30, 2018',
      site: 'Earth-Trailing Heliocentric Orbit',
      coords: '0.95–1.05 AU Heliocentric Orbit (~150M km)',
      position: [0.85, 1.35, 1.1],
      summary:
        'Revolutionary exoplanet-hunting telescope that ran out of fuel and is drifting in an Earth-trailing orbit after discovering over 2,600 alien worlds across deep space.',
      answers: {
        what: 'A 1.05m aperture Schmidt space telescope with a 95-megapixel photometer array of 42 CCDs, engineered to detect periodic transit dips in stellar brightness.',
        why: 'Exhausted its onboard hydrazine orientation propellant on October 30, 2018, after 9.5 years of continuous observations, rendering it unable to point or downlink telemetry.',
        achieved: 'Single-handedly proved that planets outnumber stars in our galaxy, observing 530,506 stars and discovering 2,662 confirmed exoplanets, including Earth-sized worlds in habitable zones.',
        where: 'Drifting permanently in an Earth-trailing heliocentric orbit around the Sun approximately 150 million kilometers away, never colliding with Earth.',
        matters: 'Fundamentally answered millennia of philosophical debate by demonstrating that rocky, potentially habitable worlds are ubiquitous throughout the cosmos.'
      }
    }
  ]
};
