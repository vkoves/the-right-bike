import type { AssessmentOption } from '../types';

export const TransportationNeedOptions: Record<string, AssessmentOption> = {
  soloCommuting: {
    label: 'Solo Commuting',
    icon: '🚴',
    description: 'Daily commuting, including light cargo'
  },
  cargo: {
    label: 'Big Cargo',
    icon: '📦',
    description: 'Carrying large amounts of groceries or goods'
  },
  transportingKids: {
    label: 'Transporting Kids',
    icon: '👶',
    description: 'Taking children to school or activities'
  },
  transportingAdults: {
    label: 'Transporting Adults',
    icon: '👩',
    description: 'Carrying adult passengers'
  }
};

export const GeographyOptions: Record<string, AssessmentOption> = {
  windy: {
    label: 'Windy',
    icon: '🌬️'
  },
  hilly: {
    label: 'Hilly',
    icon: '⛰️'
  },
  flat: {
    label: 'Mostly Flat',
    icon: '📏'
  }
};

export const FitnessOptions: Record<string, AssessmentOption> = {
  low: {
    label: 'Low',
    icon: '😅',
    description: "I'm nervous about biking at all"
  },
  medium: {
    label: 'Medium',
    icon: '🤷',
    description: "I'd be fine biking a few miles, but not too far!"
  },
  high: {
    label: 'High',
    icon: '💪',
    description: 'I could bike for a long distance, no problem!'
  }
};

export const StorageOptions: Record<string, AssessmentOption> = {
  garage: {
    label: 'Garage or Shed',
    icon: '🏠',
    description: 'Dedicated ground-level space for bikes'
  },
  basement: {
    label: 'Basement or a Few Steps',
    icon: '🚪',
    description: 'Some stairs, but manageable'
  },
  'upper-floor': {
    label: 'Upper Floor / No Storage',
    icon: '🪜',
    description: 'Need to carry bike up stairs or lock outside'
  }
};
