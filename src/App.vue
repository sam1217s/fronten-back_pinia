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

const router = useRouter()
const isAuthenticated = ref(false)

onMounted(() => {
  const token = localStorage.getItem('pruebas')
  if (token) {
    isAuthenticated.value = true
    router.push('/home')
  }
})

function handleLoginSuccess() {
  isAuthenticated.value = true
  router.push('/login.vue')
}
</script>