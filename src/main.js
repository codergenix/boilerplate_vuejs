import { createApp } from 'vue'
// ----
import createRouter from './router'
import store from './store'
import App from './App.vue'
import appInfo from './app-info'
import i18n from './i18n';
//---
const app = createApp(App)
const router = createRouter(store)
// ---
app.use(store)
app.use(router)
app.use(i18n);
// ----
app.config.globalProperties.$appInfo = appInfo
app.mount('#app')
