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
