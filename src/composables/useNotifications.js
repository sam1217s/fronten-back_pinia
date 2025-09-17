import { Notify } from 'quasar'

export function useNotifications() {
  
  // Notificación de éxito
  const success = (message, caption = '') => {
    Notify.create({
      type: 'positive',
      message: message,
      caption: caption,
      position: 'top-right',
      timeout: 3000,
      icon: 'check_circle',
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  // Notificación de error
  const error = (message, caption = '') => {
    Notify.create({
      type: 'negative',
      message: message,
      caption: caption,
      position: 'top-right',
      timeout: 4000,
      icon: 'error',
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  // Notificación de advertencia
  const warning = (message, caption = '') => {
    Notify.create({
      type: 'warning',
      message: message,
      caption: caption,
      position: 'top-right',
      timeout: 3500,
      icon: 'warning',
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  // Notificación informativa
  const info = (message, caption = '') => {
    Notify.create({
      type: 'info',
      message: message,
      caption: caption,
      position: 'top-right',
      timeout: 3000,
      icon: 'info',
      actions: [{ icon: 'close', color: 'white' }]
    })
  }

  // Notificación personalizada
  const custom = (options) => {
    const defaultOptions = {
      position: 'top-right',
      timeout: 3000,
      actions: [{ icon: 'close', color: 'white' }]
    }
    
    Notify.create({ ...defaultOptions, ...options })
  }

  return {
    success,
    error,
    warning,
    info,
    custom
  }
}