/**
 * Essential gear categories for new bike owners.
 *
 * Single source of truth for gear data used on the Gear Guide page
 * and any future references. Do NOT duplicate this data elsewhere.
 */
export const ESSENTIAL_GEAR = [
  {
    id: 'helmet',
    image: '/images/gear/helmet.webp',
    title: 'Helmet',
    description:
      'A good helmet is the single most important safety investment you can make. Modern helmets are lightweight, well-ventilated, and comfortable enough to wear on every ride.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-bike-helmet-for-commuters',
      title: 'Best Bike Helmets',
    },
  },
  {
    id: 'lights',
    image: '/images/gear/lights.webp',
    imageClass: '-extra-padding',
    title: 'Lights',
    description:
      'Front and rear lights are essential for being seen by drivers, especially during commutes at dawn, dusk, or after dark. Many cities require them by law.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-commuter-bike-lights',
      title: 'Best Bike Lights',
    },
  },
  {
    id: 'lock',
    image: '/images/gear/lock.webp',
    title: 'U-Lock',
    description:
      'A sturdy U-lock is the best defense against bike theft. Cable locks can be cut in seconds — a quality U-lock keeps your investment safe wherever you park.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-bike-lock/',
      title: 'Best Bike Lock',
    },
  },
];

export const NICE_TO_HAVE_GEAR = [
  {
    id: 'pump',
    image: '/images/gear/pump.webp',
    title: 'Floor Pump',
    description:
      'A quality floor pump with a pressure gauge makes it easy to keep your tires properly inflated — the single best thing you can do to prevent flats and keep your ride smooth.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-bike-pump',
      title: 'Best Bike Pump',
    },
  },
];

export const WINTER_GEAR = [
  {
    id: 'studded-tires',
    image: '/images/gear/studded-tires.webp',
    title: 'Studded Tires',
    description:
      'The single biggest upgrade for winter riding. Metal studs bite into ice and packed snow, giving you confident traction when regular tires would slip out.',
  },
  {
    id: 'bar-mitts',
    image: '/images/gear/bar-mitts.webp',
    title: 'Bar Mitts',
    description:
      'Handlebar-mounted pogies keep your hands warm without bulky gloves, so you keep full brake and shift control even in sub-freezing temps.',
  },
  {
    id: 'fenders',
    image: '/images/gear/fenders.webp',
    title: 'Fenders',
    description:
      'Full-coverage fenders block road slush, salt spray, and puddle splash from soaking you and corroding your drivetrain all winter long.',
  },
];
