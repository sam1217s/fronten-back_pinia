import axios from 'axios'

// Configuración base de axios
export const apiClient = axios.create({
   baseURL: 'https://inventario-15d8.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Función para establecer token dinámicamente
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    apiClient.defaults.headers['x-token'] = token
    console.log('Token establecido en axios')
  } else {
    localStorage.removeItem('token')
    delete apiClient.defaults.headers['x-token']
    console.log('Token removido de axios')
  }
}

// Función para inicializar token al cargar
export const initializeAxiosToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    apiClient.defaults.headers['x-token'] = token
    console.log('Token inicializado desde localStorage')
  }
}

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['x-token'] = token
    }
    console.log('Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.error('Response Error:', error)
    
    // Manejar errores 401 (no autorizado)
    if (error.response?.status === 401) {
      console.log('Token expirado o inválido')
      localStorage.removeItem('token')
      delete apiClient.defaults.headers['x-token']
      window.location.reload()
    }
    
    return Promise.reject(error)
  }
  
)

// Inicializar token al importar
initializeAxiosToken()

export default apiClient