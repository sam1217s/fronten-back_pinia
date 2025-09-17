import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { router } from './routers/routers.js'
import { Quasar } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

import './style.css'
import App from './App.vue'

const pinia = createPinia()
// Agregar el plugin de persistencia a Pinia
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
})
app.use(pinia)
app.use(router)
app.mount('#app')