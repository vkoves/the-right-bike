import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import main SCSS file
import './assets/scss/main.scss'

createApp(App)
  .use(router)
  .mount('#app')