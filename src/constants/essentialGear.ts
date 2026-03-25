/**
 * Essential gear categories for new bike owners.
 *
 * Single source of truth for gear data used on the Gear Guide page
 * and any future references. Do NOT duplicate this data elsewhere.
 */
import type { GearItem } from '../types';

export const ESSENTIAL_GEAR: GearItem[] = [
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
    images: ['/images/gear/lock.webp', '/images/gear/chain-lock.webp'],
    title: 'A Good Lock',
    description:
      'A sturdy U-lock or chain lock is your best defense against bike theft — cable locks can be cut in seconds. For e-bikes especially, it\'s worth spending more on an angle-grinder-resistant U-lock (like Litelock) or a heavy-duty chain lock, since the higher resale value makes them a bigger target.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-bike-lock/',
      title: 'Best Bike Lock',
    },
  },
];

export const NICE_TO_HAVE_GEAR: GearItem[] = [
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
  {
    id: 'rack',
    image: '/images/gear/rack.webp',
    title: 'Rear Rack',
    description:
      'A rear rack is the foundation for carrying anything on your bike — panniers, baskets, or bungee-strapped bags. Most cargo bikes come with one, but many commuter bikes don\'t, so check before you ride.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-rear-bike-rack/',
      title: 'Best Rear Bike Racks',
    },
  },
  {
    id: 'panniers',
    image: '/images/gear/panniers.webp',
    title: 'Panniers',
    description:
      'Rack-mounted panniers beat a backpack for hauling groceries, work gear, or anything heavier than a phone. They keep the weight low on the bike instead of on your shoulders, so you arrive less sweaty and more comfortable.',
    wirecutter: {
      url: 'https://www.nytimes.com/wirecutter/reviews/best-bike-rack-basket-panniers',
      title: 'Best Bike Racks, Baskets, and Panniers',
    },
  },
];

export const WINTER_GEAR: GearItem[] = [
  {
    id: 'studded-tires',
    image: '/images/gear/studded-tires.webp',
    imageClass: '-edge-to-edge',
    title: 'Studded Tires',
    description:
      'The single biggest upgrade for winter riding. Metal studs bite into ice and packed snow, giving you confident traction when regular tires would slip out.',
  },
  {
    id: 'bar-mitts',
    image: '/images/gear/bar-mitts.webp',
    title: 'Pogies/Bar Mitts',
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
