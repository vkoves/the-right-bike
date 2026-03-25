import type { BikeTypeId, BikeModel, RecommendationTier } from '../types';

/** Recommended bike models by tier by type */
export const BikeRecommendations: Record<BikeTypeId, Record<RecommendationTier, BikeModel[]>> = {
  'regular-bike': {
    budget: [
      {
        model: 'Retrospec Beaumont City Bike',
        price: '$299',
        image: '/images/bike-models/retrospec-beaumont.webp',
        review: 'https://electricbikereview.com/retrospec/beaumont-rev-2-review/',
        singleSpeed: false,
      },
      {
        model: 'Gazelle Tour Populair',
        price: '$599',
        image: '/images/bike-models/gazelle-tour-populair.webp',
        review: 'https://ridereview.com/products/gazelle-tour-populair',
        singleSpeed: true
      }
    ],
    midrange: [
      {
        model: 'Priority Continuum Onyx',
        price: '$1,349',
        image: '/images/bike-models/priority-continuum-onyx.webp',
        review: 'https://www.cyclingweekly.com/reviews/hybrid-bikes/priority-continuum-onyx',
        singleSpeed: true,
        lightweight: true,
      }
    ],
    premium: [
      {
        model: 'Brompton C-line',
        price: '$1,720',
        image: '/images/bike-models/brompton-c-line.webp',
        review: 'https://www.gearpatrol.com/outdoors/brompton-c-line-explore-review/',
        lightweight: true
      }
    ]
  },
  'commuter-ebike': {
    budget: [
      {
        model: 'Velotric T1 ST Plus',
        price: '$1,299',
        image: '/images/bike-models/velotric-t1-st-plus.webp',
        review:'https://electricbikereport.com/velotric-t1-st-review',
        lightweight: true
      },
      {
        model: 'REI Co-op Cycles CTY e2.1',
        price: '$1,799',
        image: '/images/bike-models/rei-cty-e21.webp',
        review: 'https://www.wired.com/review/rei-cty-e21/'
      }
    ],
    midrange: [
      {
        model: 'Ride1Up Roadster V3',
        price: '$1,395',
        image: '/images/bike-models/ride1up-roadster-v3.webp',
        review: 'https://electricbikereview.com/ride1up/roadster-v3-st-review/',
        lightweight: true
      },
      {
        model: 'Specialized Haul ST',
        price: '$2,400',
        image: '/images/bike-models/specialized-globe-haul-st.webp',
        review: 'https://www.outdoorgearlab.com/reviews/biking/cargo-bike/specialized-globe-haul-st'
      }
    ],
    premium: [
      {
        model: 'Gazelle Ultimate T10 HMB',
        price: '$3,799',
        image: '/images/bike-models/gazelle-ultimate-t10.webp',
        review: 'https://electricbikereview.com/gazelle/ultimate-t10-hmb/'
      }
    ]
  },
  // TODO: FIND NEW BIKES - we should rename this segment frontloader-bike or something
  'cargo-bike': {
    budget: [
      {
        model: 'Mongoose Envoy',
        price: '$1,000',
        image: '/images/bike-models/mongoose-envoy.webp',
        review: 'https://www.walmart.com/ip/Mongoose-Envoy-Adult-Cargo-Bike-Large-Frame-Ages-14-and-up-Grey/2621147224'
      }
    ],
    midrange: [
      {
        model: 'Yuba Kombi',
        price: '$1,200',
        image: '/images/bike-models/yuba-kombi.webp',
        review: 'https://www.bicycling.com/bikes-gear/a25054215/best-cargo-bikes/'
      }
    ],
    premium: [
      {
        model: 'Omnium Cargo V3',
        price: '$2,500+',
        image: '/images/bike-models/omnium-cargo-v3.webp',
        review: 'https://www.hovsco.com/blogs/cargo-utility-e-bikes/which-non-electric-cargo-bike-should-you-buy-in-2025'
      }
    ]
  },
  // TODO: Rename to frontloader-ebike
  'cargo-ebike': {
    budget: [
      {
        model: 'Bakfiets.nl Cargo Bike (Electric)',
        price: '$3,800',
        image: '/images/bike-models/bakfiets-cargo-long.webp',
        review: 'https://www.amsterdam-bicycle.com/shop/electric-cargo-bikes/e-cargo-classic-long/'
      }
    ],
    midrange: [
      {
        model: 'Yuba Supercargo CL',
        price: '$4,999',
        image: '/images/bike-models/yuba-supercargo.webp',
        review: 'https://garageotr.com/yuba-supercargo-cl/'
      }
    ],
    premium: [
      {
        model: 'Bunch The Original',
        price: '$6,499',
        image: '/images/bike-models/bunch-the-original.webp',
        review: 'https://www.outdoorgearlab.com/reviews/biking/cargo-bike/bunch-the-original',
        trike: true
      },
      {
        model: 'Urban Arrow FamilyNext',
        price: '$7,999',
        image: '/images/bike-models/urban-arrow-family.webp',
        review: 'https://urbanarrow.com/family-bikes/familynext'
      }
    ]
  },
  'longtail-bike': {
    budget: [
      {
        model: 'Yuba Mundo (Non-Electric)',
        price: '$1,800',
        image: '/images/bike-models/yuba-mundo.webp',
        review: 'https://www.hovsco.com/blogs/cargo-utility-e-bikes/what-are-the-best-non-electric-cargo-bikes-for-practical-urban-transport'
      }
    ],
    midrange: [
      {
        model: 'Surly Big Dummy',
        price: '$2,100',
        image: '/images/bike-models/surly-big-dummy.webp',
        review: 'https://surlybikes.com/products/big-dummy'
      }
    ],
    premium: [
      {
        model: 'Xtracycle Edgerunner (Classic)',
        price: '$2,500',
        image: '/images/bike-models/xtracycle-edgerunner.webp',
        review: 'https://electricbikereview.com/best-electric-cargo-bikes/'
      }
    ]
  },
  'longtail-ebike': {
    budget: [
      {
        model: 'Lectric XPedition 2.0',
        price: '$1,399',
        image: '/images/bike-models/lectric-xpedition-2.webp',
        review: 'https://electricbikereport.com/lectric-xpedition-2-review/'
      }
    ],
    midrange: [
      {
        model: 'Tern Quick Haul Long D9',
        price: '$3,799',
        image: '/images/bike-models/tern-quick-haul-long.webp',
        review: 'https://velo.outsideonline.com/ebike/ebike-gear/review-tern-quick-haul-long-cargo-bike/'
      }
    ],
    premium: [
      {
        model: 'Tern GSD S10 Gen 3',
        price: '$5,900',
        image: '/images/bike-models/tern-gsd-s10.webp',
        review: 'https://www.cyclingweekly.com/reviews/e-bikes/terns-compact-e-cargo-bike-is-so-easy-to-ride-and-so-adaptable-it-can-help-anyone-get-stuff-done'
      }
    ]
  }
};
