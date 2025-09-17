import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'

// Views/Pages  
import PageOne from '../views/Productos.vue'
import Productos from '../views/Clientes.vue'
import PageThree from '../views/Ventas.vue'
import ErrorNotFound from '../views/ErrorNotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',        
        redirect: '/home'
      },
      {
        path: '/productos',
        name: 'PageOne',
        component: PageOne
      },
      {
        path: '/clientes',
        name: 'Productos',
        component: Productos
      },
      {
        path: '/ventas',
        name: 'PageThree',
        component: PageThree
      }
    ]
  },
  
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Guard de navegación simplificado
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('pruebas')
    if (!token) {
      next(false)
      return
    }
  }
  next()
})

export default router