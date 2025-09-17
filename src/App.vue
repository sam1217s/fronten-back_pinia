<template>
  <q-app>
    <div v-if="!isAuthenticated">
      <Login @login-success="handleLoginSuccess" />
    </div>
    
    <router-view v-else />
  </q-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Login from './components/Login.vue'
import { apiClient } from './plugins/pluginAxios.js'

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  const tokenData = JSON.parse(localStorage.getItem('pruebas') || '{}')
  
  if (tokenData.token) {
    // CONFIGURAR el token en axios al montar la aplicación
    apiClient.defaults.headers['x-token'] = tokenData.token
    console.log('Token configurado en onMounted')
    
    isAuthenticated.value = true
    router.push('/productos')
  }
})

function handleLoginSuccess() {
  isAuthenticated.value = true
  router.push('/productos')
}
</script>