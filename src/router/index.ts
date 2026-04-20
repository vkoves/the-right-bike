import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AboutPage from '../components/AboutPage.vue'
import BikeAssessment from '../components/assessment/BikeAssessment.vue'
import GearGuidePage from '../components/GearGuidePage.vue'
import MaintenancePage from '../components/MaintenancePage.vue'
import StoragePage from '../components/StoragePage.vue'
import SocialImage from '../components/SocialImage.vue'
import SocialImageBike from '../components/SocialImageBike.vue'
import SocialImagePage from '../components/SocialImagePage.vue'
import AdSquare from '../components/AdSquare.vue'
import AllBikesPage from '../components/AllBikesPage.vue'
import AdminPage from '../components/AdminPage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'
import { SiteName, PageMeta } from '../constants/pageMeta'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage,
    meta: { title: PageMeta.about.title }
  },
  {
    path: '/assessment',
    name: 'Assessment',
    component: BikeAssessment
  },
  {
    path: '/bike/:type',
    name: 'BikeResult',
    component: BikeAssessment,
    props: true
  },
  {
    path: '/gear-guide',
    name: 'GearGuide',
    component: GearGuidePage,
    meta: { title: PageMeta['gear-guide'].title }
  },
  {
    path: '/maintenance',
    name: 'Maintenance',
    component: MaintenancePage,
    meta: { title: PageMeta.maintenance.title }
  },
  {
    path: '/storage',
    name: 'Storage',
    component: StoragePage,
    meta: { title: PageMeta.storage.title }
  },
  {
    path: '/social-image',
    name: 'SocialImage',
    component: SocialImage,
    meta: { bare: true }
  },
  {
    path: '/social-image/:type',
    name: 'SocialImageBike',
    component: SocialImageBike,
    meta: { bare: true },
    props: true
  },
  {
    path: '/social-image/page/:slug',
    name: 'SocialImagePage',
    component: SocialImagePage,
    meta: { bare: true },
    props: true
  },
  {
    path: '/ads/square',
    name: 'AdSquare',
    component: AdSquare,
    meta: { bare: true }
  },
  {
    path: '/bikes',
    name: 'AllBikes',
    component: AllBikesPage
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from) {
    if (to.hash) {
      // Wait for the target element to appear in the DOM (it may render async),
      // then scroll manually so scroll-margin-top is respected.
      return new Promise((resolve) => {
        const maxAttempts = 50;
        let attempts = 0;
        const poll = setInterval(() => {
          attempts++;
          const el = document.querySelector(to.hash);
          if (el || attempts >= maxAttempts) {
            clearInterval(poll);
            if (el) {
              // Let the browser handle scroll-margin-top via scrollIntoView
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              resolve(false); // Tell the router not to scroll again
            } else {
              resolve({ el: to.hash, behavior: 'smooth' });
            }
          }
        }, 100);
      });
    }
    if (to.path !== from.path) {
      return new Promise((resolve) => {
        setTimeout(() => resolve({ top: 0 }), 100)
      })
    }
  }
})

router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined;
  document.title = pageTitle ? `${pageTitle} - ${SiteName}` : SiteName;
})

export default router