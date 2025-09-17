import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
    state: () => ({
        userName: "Alex", // Nombre por defecto
    }),
    
    actions: {
        updateUserName(newName) {
            this.userName = newName;
        },
        
        async login(correo, contra) {
            try {
                const response = await axios.post('http://localhost:3000/api/login', {
                    email: correo,
                    password: contra
                });
                
                console.log(response.data);
                return response.data;
                
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    },
    
    persist: {
        storage: localStorage, // Usar localStorage
        paths: ['userName'] // Solo persistir el userName
    }
});