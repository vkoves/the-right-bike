import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AboutPage from '../components/AboutPage.vue'
import BikeAssessment from '../components/assessment/BikeAssessment.vue'
import GearGuidePage from '../components/GearGuidePage.vue'
import SocialImage from '../components/SocialImage.vue'
import SocialImageBike from '../components/SocialImageBike.vue'
import AdminPage from '../components/AdminPage.vue'
import NotFoundPage from '../components/NotFoundPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
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
    component: GearGuidePage
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
    if (to.path !== from.path) {
      return { top: 0 }
    }
  }
})

export default router