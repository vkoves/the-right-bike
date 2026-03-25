import type { BikeTypeId, BikeModel } from '../types';

/** Recommended bike models per type, scored and filtered by the recommender */
export const BikeRecommendations: Record<BikeTypeId, BikeModel[]> = {
  'regular-bike': [
    {
      model: 'Retrospec Beaumont City Bike',
      price: '$299',
      tier: 'budget',
      image: '/images/bike-models/retrospec-beaumont.webp',
      review: 'https://retrospec.com/collections/beaumont-city-bikes/products/beaumont-7-speed-diamond-city-bike',
    },
    {
      model: 'Gazelle Tour Populair',
      price: '$599',
      tier: 'midrange',
      image: '/images/bike-models/gazelle-tour-populair.webp',
      review: 'https://ridereview.com/products/gazelle-tour-populair',
      singleSpeed: true
    },
    {
      model: 'Priority Continuum Onyx',
      price: '$1,349',
      tier: 'premium',
      image: '/images/bike-models/priority-continuum-onyx.webp',
      review: 'https://www.cyclingweekly.com/reviews/hybrid-bikes/priority-continuum-onyx',
      lightweight: true,
    },
    {
      model: 'Brompton C-line',
      price: '$1,720',
      tier: 'premium',
      image: '/images/bike-models/brompton-c-line.webp',
      review: 'https://www.gearpatrol.com/outdoors/brompton-c-line-explore-review/',
      lightweight: true
    }
  ],
  'commuter-ebike': [
    {
      model: 'Velotric T1 ST Plus',
      price: '$1,299',
      tier: 'budget',
      image: '/images/bike-models/velotric-t1-st-plus.webp',
      review: 'https://electricbikereport.com/velotric-t1-st-review',
      lightweight: true
    },
    {
      model: 'REI Co-op Cycles CTY e2.1',
      price: '$1,799',
      tier: 'budget',
      image: '/images/bike-models/rei-cty-e21.webp',
      review: 'https://www.wired.com/review/rei-cty-e21/'
    },
    {
      model: 'Ride1Up Roadster V3',
      price: '$1,395',
      tier: 'midrange',
      image: '/images/bike-models/ride1up-roadster-v3.webp',
      review: 'https://electricbikereview.com/ride1up/roadster-v3-st-review/',
      lightweight: true,
      singleSpeed: true
    },
    {
      model: 'Specialized Haul ST',
      price: '$2,400',
      tier: 'midrange',
      image: '/images/bike-models/specialized-globe-haul-st.webp',
      review: 'https://www.outdoorgearlab.com/reviews/biking/cargo-bike/specialized-globe-haul-st'
    },
    {
      model: 'Gazelle Ultimate T10 HMB',
      price: '$3,799',
      tier: 'premium',
      image: '/images/bike-models/gazelle-ultimate-t10.webp',
      review: 'https://electricbikereview.com/gazelle/ultimate-t10-hmb/'
    }
  ],
  // TODO: FIND NEW BIKES - we should rename this segment frontloader-bike or something
  'cargo-bike': [
    {
      model: 'Mongoose Envoy',
      price: '$1,000',
      tier: 'budget',
      image: '/images/bike-models/mongoose-envoy.webp',
      review: 'https://www.walmart.com/ip/Mongoose-Envoy-Adult-Cargo-Bike-Large-Frame-Ages-14-and-up-Grey/2621147224'
    },
    {
      model: 'Yuba Kombi',
      price: '$1,200',
      tier: 'midrange',
      image: '/images/bike-models/yuba-kombi.webp',
      review: 'https://www.bicycling.com/bikes-gear/a25054215/best-cargo-bikes/'
    },
    {
      model: 'Omnium Cargo V3',
      price: '$2,500+',
      tier: 'premium',
      image: '/images/bike-models/omnium-cargo-v3.webp',
      review: 'https://www.hovsco.com/blogs/cargo-utility-e-bikes/which-non-electric-cargo-bike-should-you-buy-in-2025'
    }
  ],
  // TODO: Rename to frontloader-ebike
  'cargo-ebike': [
    {
      model: 'Bakfiets.nl Cargo Bike (Electric)',
      price: '$3,800',
      tier: 'budget',
      image: '/images/bike-models/bakfiets-cargo-long.webp',
      review: 'https://www.amsterdam-bicycle.com/shop/electric-cargo-bikes/e-cargo-classic-long/'
    },
    {
      model: 'Yuba Supercargo CL',
      price: '$4,999',
      tier: 'midrange',
      image: '/images/bike-models/yuba-supercargo.webp',
      review: 'https://garageotr.com/yuba-supercargo-cl/'
    },
    {
      model: 'Bunch The Original',
      price: '$6,499',
      tier: 'premium',
      image: '/images/bike-models/bunch-the-original.webp',
      // Old review - higher profile but quite old
      // review: 'https://www.outdoorgearlab.com/reviews/biking/cargo-bike/bunch-the-original',
      review: 'https://www.twowheelingtots.com/bunch-bike-cargo-ebike-review',
      trike: true
    },
    {
      model: 'Urban Arrow FamilyNext',
      price: '$7,999',
      tier: 'premium',
      image: '/images/bike-models/urban-arrow-family.webp',
      review: 'https://urbanarrow.com/family-bikes/familynext'
    }
  ],
  'longtail-bike': [
    {
      model: 'Yuba Mundo (Non-Electric)',
      price: '$1,800',
      tier: 'budget',
      image: '/images/bike-models/yuba-mundo.webp',
      review: 'https://www.hovsco.com/blogs/cargo-utility-e-bikes/what-are-the-best-non-electric-cargo-bikes-for-practical-urban-transport'
    },
    {
      model: 'Surly Big Dummy',
      price: '$2,100',
      tier: 'midrange',
      image: '/images/bike-models/surly-big-dummy.webp',
      review: 'https://surlybikes.com/products/big-dummy'
    },
    {
      model: 'Xtracycle Edgerunner (Classic)',
      price: '$2,500',
      tier: 'premium',
      image: '/images/bike-models/xtracycle-edgerunner.webp',
      review: 'https://electricbikereview.com/best-electric-cargo-bikes/'
    }
  ],
  'longtail-ebike': [
    {
      model: 'Lectric XPedition 2.0',
      price: '$1,399',
      tier: 'budget',
      image: '/images/bike-models/lectric-xpedition-2.webp',
      review: 'https://electricbikereport.com/lectric-xpedition-2-review/'
    },
    {
      model: 'Aventon Abound LR',
      price: '$1,999',
      tier: 'midrange',
      image: '/images/bike-models/aventon-abound-lr.webp',
      review: 'https://www.outdoorgearlab.com/reviews/biking/cargo-bike/aventon-abound-lr',
      // purchaseLink: 'https://www.aventon.com/products/abound-lr-ebike'
    },
    {
      model: 'Tern Quick Haul Long D9',
      price: '$3,799',
      tier: 'midrange',
      image: '/images/bike-models/tern-quick-haul-long.webp',
      review: 'https://velo.outsideonline.com/ebike/ebike-gear/review-tern-quick-haul-long-cargo-bike/'
    },
    {
      model: 'Tern GSD S10 Gen 3',
      price: '$5,900',
      tier: 'premium',
      image: '/images/bike-models/tern-gsd-s10.webp',
      review: 'https://www.cyclingweekly.com/reviews/e-bikes/terns-compact-e-cargo-bike-is-so-easy-to-ride-and-so-adaptable-it-can-help-anyone-get-stuff-done'
    }
  ]
};
