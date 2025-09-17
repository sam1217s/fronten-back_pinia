<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          Sistema de Inventario
        </q-toolbar-title>
        
        <q-btn 
          flat 
          round 
          dense 
          icon="logout" 
          @click="handleLogout"
        />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/productos" label="Productos" icon="home" />
        <q-route-tab to="/clientes" label="Clientes" icon="production_quantity_limits" />
        <q-route-tab to="/ventas" label="Ventas" icon="person" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function handleLogout() {
  localStorage.removeItem('pruebas')
  router.push('/')
  location.reload()
}
</script>