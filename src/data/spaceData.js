// NASA Space Science Data Coordinated Archive (NSSDCA) & NASA 3D Verified Data
// Theme: "Abandoned but Not Forgotten" - Reframing discarded celestial hardware as enduring monuments

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
      'Earth\'s eternal companion holds 110+ human artifacts. What critics once dismissed as discarded aluminum and titanium are now preserved time-capsules of 20th-century courage. In the airless lunar silence, the descent stages, roving buggies, and science stations remain exactly as left—pristine monuments waiting for humanity\'s return.',
    monumentsCount: '110+ Catalogued Cultural Relics',
    coordinates: 'Tranquility Base // Oceanus Procellarum'
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
      'The Red Planet is a cemetery of triumphs. More than a dozen robotic emissaries have braved interplanetary transit, dust storms, and atmospheric entry. From tiny helicopters to marathon-running rovers, these machines became humanity’s sensory organs on an alien world—standing silent watch over rust-red dunes until the first astronauts arrive.',
    monumentsCount: '18 Surface Relics & Landers',
    coordinates: 'Jezero Crater // Meridiani // Chryse'
  }
};

export const HOTSPOTS_DATA = {
  moon: [
    {
      id: 'apollo11',
      title: 'Apollo 11 Descent Stage',
      codename: 'EAGLE (LM-5)',
      mission: 'Apollo 11 // NASA',
      date: 'July 20, 1969',
      site: 'Mare Tranquillitatis (Sea of Tranquility)',
      coords: '0.67408° N, 23.47297° E',
      position: [1.25, 0.45, 1.45], // 3D coordinates on surface
      answers: {
        what: 'The lower half of Apollo 11\'s Lunar Module "Eagle", constructed by Grumman Aerospace. It housed the descent rocket engine, landing gear, and the Early Apollo Scientific Experiments Package (EASEP).',
        why: 'It was intentionally left behind as a launch platform. The ascent stage fired its engine using the descent stage as a launch pad to return Neil Armstrong and Buzz Aldrin to the orbiting Command Module, shedding dead weight for the return voyage.',
        achieved: 'Enabled the first human footprints on another celestial body. Housed the Lunar Retroreflector array (which measures lunar distance via lasers to millimeter accuracy to this day) and solar wind composition experiments.',
        where: 'Rests intact at Tranquility Base. Its gold-aluminized Mylar Kapton thermal foil has faded and blistered after 55+ years of intense unfiltered solar ultraviolet radiation and micrometeoroid showers.',
        matters: 'It is humanity\'s inaugural archaeological site in space. Recognized under the Artemis Accords Heritage Preservation standard to legally protect historic lunar sites from exhaust plumes of future commercial landers.'
      }
    },
    {
      id: 'lrv15',
      title: 'Lunar Roving Vehicle (LRV-001)',
      codename: 'HADLEY BUGGY',
      mission: 'Apollo 15 // NASA / Boeing',
      date: 'July 30, 1971',
      site: 'Hadley-Apennine Basin',
      coords: '26.1322° N, 3.6339° E',
      position: [-1.4, 0.8, 1.1],
      answers: {
        what: 'The world\'s first crewed extraterrestrial rover—a lightweight electric vehicle designed with wire-mesh wheels, chevron titanium treads, and joy-stick steering.',
        why: 'Weighing 210 kg, it exceeded the lift capacity of the Lunar Module ascent stage. Abandoning the rover allowed astronauts Dave Scott and Jim Irwin to bring home 77 kg of prime lunar geology samples instead.',
        achieved: 'Transformed lunar exploration from localized steps into planetary expeditions. Traversed 27.9 km and reached speeds of 13 km/h, leading directly to the recovery of the 4-billion-year-old "Genesis Rock" (Sample 15415).',
        where: 'Parked approximately 100 meters east of Falcon\'s descent stage at Hadley Rille, with its high-gain antenna and RCA color TV camera permanently aimed upward where it recorded the Apollo 15 liftoff.',
        matters: 'Serves as the foundational mobility benchmark for NASA\'s upcoming Artemis Lunar Terrain Vehicle (LTV) and autonomous pressurized rover concepts.'
      }
    },
    {
      id: 'surveyor3',
      title: 'Surveyor 3 Robotic Lander',
      codename: 'SCIENTIFIC SCOUT',
      mission: 'Surveyor Program // NASA JPL',
      date: 'April 20, 1967',
      site: 'Oceanus Procellarum (Ocean of Storms)',
      coords: '3.0163° S, 23.4180° W',
      position: [0.3, -1.2, 1.5],
      answers: {
        what: 'An early three-legged robotic spacecraft equipped with a television camera, surface sampler scoop, and radar altimeters to map lunar soil load-bearing strength.',
        why: 'Designed as a one-way robotic reconnaissance mission. Its batteries froze during the deep freeze of the two-week lunar night after completing primary scientific transmissions.',
        achieved: 'Conducted the first mechanical trenching of lunar regolith (digging 17.5 cm deep), proving the Moon\'s surface could physically support the weight of heavy Apollo human landers without sinking.',
        where: 'Resting inside Surveyor Crater. In November 1969, Apollo 12 executed a pinpoint landing only 160 meters away; astronauts Pete Conrad and Alan Bean walked over and retrieved its camera and scoop for return to Earth.',
        matters: 'The retrieved components provided the only real-world empirical data in human history on how terrestrial materials and microbes (Streptococcus mitis) survive years in deep space vacuum and solar radiation.'
      }
    }
  ],
  mars: [
    {
      id: 'ingenuity',
      title: 'Ingenuity Mars Helicopter',
      codename: 'GINNY (TECH DEMO)',
      mission: 'Mars 2020 // NASA JPL',
      date: 'Arrived Feb 18, 2021 | Retired Jan 25, 2024',
      site: 'Jezero Crater // Neretva Vallis Airfield',
      coords: '18.4447° N, 77.4508° E',
      position: [1.3, 0.7, 1.35],
      answers: {
        what: 'A 1.8 kg twin-rotor autonomous rotorcraft engineered to achieve aerodynamic flight in an atmosphere with less than 1% of Earth\'s density.',
        why: 'During Flight 72 on January 18, 2024, one or more carbon-fiber rotor blades suffered tip damage during an emergency descent, preventing aerodynamic stability for future takeoffs.',
        achieved: 'Accomplished the first powered, controlled flight on an alien planet. Originally slated for 5 demonstration flights, it completed 72 flights, covered 17.0 km, logged 128.8 flight minutes, and served as an aerial scout for Perseverance.',
        where: 'Stationed atop the ripple sands of Neretva Vallis in Jezero Crater. Its solar panel continues collecting power, running diagnostic avionics, and transmitting environmental sensor records to Perseverance.',
        matters: 'Pioneered planetary aerial robotics. Directly inspired the Mars Sample Recovery Helicopters and the Dragonfly nuclear octocopter mission to Saturn\'s moon Titan.'
      }
    },
    {
      id: 'viking1',
      title: 'Viking 1 Lander',
      codename: 'THOMAS MUTCH MEMORIAL STATION',
      mission: 'Viking Program // NASA Langley/JPL',
      date: 'July 20, 1976',
      site: 'Chryse Planitia (Plains of Gold)',
      coords: '22.48° N, 47.97° W',
      position: [-1.4, 0.5, 1.2],
      answers: {
        what: 'NASA\'s first successful long-duration Mars surface lander, powered by dual SNAP-19 Radioisotope Thermoelectric Generators (RTGs) and equipped with gas chromatograph mass spectrometers and meteorology booms.',
        why: 'Stationary lander without propulsion for ascent. Ceased operations in November 1982 after a faulty software command inadvertently overwrote antenna tracking coordinates, breaking communications with Earth.',
        achieved: 'Returned the first color panoramic surface photographs of Mars, took 57,000 images, performed the first in-situ biological tests for Martian microbes, and monitored Martian weather patterns for 2,245 sols (over 6 Earth years).',
        where: 'Silently standing among the boulder-strewn sands of Chryse Planitia, designated by NASA as the Thomas A. Mutch Memorial Station.',
        matters: 'Established the scientific benchmark for Martian surface chemistry and planetary protection protocols still honored by modern rovers today.'
      }
    },
    {
      id: 'opportunity',
      title: 'Opportunity Rover',
      codename: 'MER-B // OPPY',
      mission: 'Mars Exploration Rover // NASA JPL',
      date: 'Jan 25, 2004 | Retired Feb 13, 2019',
      site: 'Meridiani Planum // Perseverance Valley',
      coords: '1.95° S, 354.47° E',
      position: [0.4, -1.2, 1.45],
      answers: {
        what: 'A six-wheeled solar-powered mobile robotic geologist equipped with a microscopic imager, Mössbauer spectrometer, and rock abrasion tool.',
        why: 'In June 2018, a catastrophic planet-encircling dust storm blocked 99% of sunlight from reaching its solar arrays. Despite over 1,000 recovery signals beamed from Earth, its batteries drained into an unrecoverable sleep.',
        achieved: 'Designed for a 90-sol warranty; survived 5,111 sols (nearly 15 years!). Traversed 45.16 km (more than a marathon), discovered hematite spherules ("blueberries"), and proved ancient Mars possessed standing liquid, potable water.',
        where: 'Resting on the upper slopes of Perseverance Valley along the rim of Endeavour Crater.',
        matters: 'The ultimate symbol of robotic endurance and emotional human connection to machines. It proved that deep robotic space missions can far outlast their design specifications.'
      }
    }
  ]
};
