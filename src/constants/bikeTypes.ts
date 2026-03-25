/**
 * Master list of all supported bike types.
 *
 * This is the single source of truth for bike metadata used across the app
 * (assessment results, savings comparison, homepage gallery, etc.).
 * Do NOT duplicate this data in individual components.
 */
import type { BikeTypeId, BikeType } from '../types';

export const BikeTypes: Record<BikeTypeId, BikeType> = {
  'regular-bike': {
    title: 'Regular Bicycle',
    label: 'Regular Bicycle',
    image: '/images/bikes/dutch-bike.jpg',
    electric: false,
    bulky: false,
    description: 'A traditional bicycle is perfect for your needs. With your fitness level and local conditions, you\'ll be able to navigate comfortably without electric assistance.',
    features: [
      'Lightweight and maneuverable',
      'Lower cost than electric alternatives',
      'Simple maintenance',
      'No charging required'
    ],
    priceRange: '$300 - $1,000'
  },
  'commuter-ebike': {
    title: 'Commuter eBike',
    label: 'Commuter eBike',
    image: '/images/bikes/gazelle-ebike.jpg',
    electric: true,
    bulky: false,
    description: 'A commuter eBike is ideal for your situation. The electric assistance will help with hills, wind, or longer distances while maintaining the convenience of a standard bicycle.',
    features: [
      'Electric motor assists up to 20-28 mph',
      'Helps overcome hills and wind resistance',
      'Reduces sweat during commutes',
      '20-50 mile range per charge'
    ],
    priceRange: '$1,500 - $4,000'
  },
  'cargo-bike': {
    title: 'Classic Cargo Bike',
    label: 'Non-Electric Cargo Bike',
    image: '/images/bikes/bakfiets-classic-long.jpg',
    electric: false,
    bulky: true,
    storageDowngrade: 'regular-bike',
    description: 'A non-electric cargo bike will address your carrying needs. These bikes are designed to handle loads while maintaining stability and ease of use without requiring battery power.',
    features: [
      'Front cargo box for groceries and goods',
      'Stable frame design for carrying heavy loads',
      'Can transport goods, groceries, or equipment',
      'No battery to charge or maintain'
    ],
    priceRange: '$1,000 - $2,500'
  },
  'cargo-ebike': {
    title: 'Front-Loader Cargo eBike',
    label: 'Cargo eBike',
    image: '/images/bikes/urban-arrow.jpg',
    electric: true,
    bulky: true,
    storageDowngrade: 'commuter-ebike',
    description: 'A cargo eBike with front loading design is perfect for your needs. The electric assistance makes hauling cargo easier, while the bucket design is ideal for groceries and goods.',
    features: [
      'Large front cargo area for groceries or goods',
      'Electric assist makes carrying loads easier',
      'Stable even when fully loaded',
      'Can replace a car for most errands'
    ],
    priceRange: '$3,000 - $6,000'
  },
  'longtail-bike': {
    title: 'Longtail Cargo Bike',
    label: 'Non-Electric Longtail Bike',
    image: '/images/bikes/yuba-mundo.jpg',
    electric: false,
    bulky: true,
    storageDowngrade: 'regular-bike',
    description: 'A non-electric longtail cargo bike is perfect for transporting people and heavy loads. With your fitness level, you can handle this sturdy bike without electric assistance while still carrying passengers or cargo.',
    features: [
      'Extended rear deck for passengers or cargo',
      'High weight capacity (up to 550 lbs)',
      'Can carry several children',
      'No battery charging required'
    ],
    priceRange: '$1,800 - $2,200'
  },
  'longtail-ebike': {
    title: 'Longtail Cargo eBike',
    label: 'Longtail Cargo eBike',
    image: '/images/bikes/tern-gsd-500.jpg',
    electric: true,
    bulky: true,
    storageDowngrade: 'commuter-ebike',
    description: 'A longtail cargo eBike is ideal for transporting people. The extended rear section provides seating for children or adults while electric assistance makes the ride effortless.',
    features: [
      'Extended rear deck for passengers',
      'Electric assist makes carrying passengers easier',
      'Can accommodate child seats or passenger seating',
      'High weight capacity'
    ],
    priceRange: '$3,500 - $8,000'
  }
};
