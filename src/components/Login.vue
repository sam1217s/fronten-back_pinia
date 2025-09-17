<template>
  <div class="login-container">
    <q-card class="login-card q-pa-lg">
      <q-card-section class="text-center">
        <div class="text-h4 text-primary q-mb-md">Iniciar Sesión</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit="handleLogin">
          <q-input
            v-model="email"
            type="email"
            label="Correo Electrónico"
            outlined
            class="q-mb-md"
          />

          <q-input
            v-model="password"
            type="password"
            label="Contraseña"
            outlined
            class="q-mb-md"
          />
<!-- aca se maneja boton submit con estado de carga -->
          <q-btn
            type="submit"
            color="primary"
            size="lg"
            class="full-width"
            label="Iniciar Sesión"
            :loading="isLoading"
            :disable="isLoading"
          >
          <!-- aca se implementa un slot-->
            <template v-slot:loading>
              <q-spinner-oval class="on-left" />
              Iniciando sesión...
            </template>
          </q-btn>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { postData } from "../services/apiClient.js";
import { useNotifications } from "../composables/useNotifications.js";

const { success, error, warning } = useNotifications();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const emit = defineEmits(["login-success"]);

async function handleLogin() {
  if (!email.value || !password.value) {
    warning("Completa todos los campos", "Correo y contraseña son requeridos");
    return;
  }
  isLoading.value = true;
  try {
    let r = await postData("usuarios/loguin_usuario", {
      correo: email.value,
      password: password.value,
    });

    console.log(r);

    if (r.token) {
      localStorage.setItem("pruebas", JSON.stringify({ token: r.token }));
      success("¡Bienvenido al sistema!", "Login exitoso");
      emit("login-success");
    } else {
      error(
        "Credenciales incorrectas",
        r.msg || "Usuario o contraseña inválidos"
      );
    }
  } catch (err) {
    console.log("Error:", err);

    // Ahora "error" sigue siendo la función de notificaciones
    if (err.response && err.response.status === 400) {
      error("Credenciales incorrectas", err.response.data.msg);
    } else {
      error("Error de conexión", "Verifica tu internet e intenta nuevamente");
    }
  }
  finally {
    isLoading.value = false  
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #b27373 0%, #432de9 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  min-height: 400px;
  border-radius: 45px;
}
</style>
