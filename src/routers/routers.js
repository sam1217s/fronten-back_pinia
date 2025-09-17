import { createRouter, createWebHistory } from 'vue-router'

// Layouts
import MainLayout from '../layouts/MainLayout.vue'

// Views/Pages  
import Productos from '../views/Productos.vue'
import Clientes from '../views/Clientes.vue'
import Ventas from '../views/Ventas.vue'
import ErrorNotFound from '../views/ErrorNotFound.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',        
        redirect: '/productos'
      },
      {
        path: '/productos',
        name: 'Productos',
        component: Productos
      },
      {
        path: '/clientes',
        name: 'Clientes',
        component: Clientes
      },
      {
        path: '/ventas',
        name: 'Ventas',
        component: Ventas
      }
    ]
  },
  
  {
    path: '/:catchAll(.*)*',
    component: ErrorNotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router