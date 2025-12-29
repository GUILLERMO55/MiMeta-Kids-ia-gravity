import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    es: {
        translation: {
            "welcome": "Bienvenido a MiMeta Kids",
            "tasks": "Tareas",
            "rewards": "Recompensas",
            "wallet": "Monedero",
            "settings": "Ajustes",
            "new_task": "Nueva Tarea",
            "validate": "Validar",
            "streak": "Racha",
            "balance": "Tu dinero",
            // Add more as we build UI
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "es", // default language
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
