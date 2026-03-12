import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import AboutPage from '../components/AboutPage.vue'
import BikeAssessment from '../components/assessment/BikeAssessment.vue'
import SocialImage from '../components/SocialImage.vue'

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
    path: '/social-image',
    name: 'SocialImage',
    component: SocialImage,
    meta: { bare: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router