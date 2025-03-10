import axios from 'axios'
import appBaseUrls from '@/services/base-url.service'
import authHeader from '@/services/auth-header'
import _ from 'lodash'
import { computed } from 'vue';
import dayjs from 'dayjs';
import store from '@/store';
// ---
const caxios = axios.create({
  baseURL: `${appBaseUrls.backend}/`
})
const loggedUser = computed(() => store.state.auth.user)
/**
 * INTERCEPTORS
 */
caxios.interceptors.request.use(
  (config) => {
    _.merge(config.headers, { 'Content-Type': 'application/json' })
    _.merge(config.headers, authHeader())
    if (loggedUser?.value?.tokenExpiration && config?.url !== 'refresh-token') {
      const nowDate = dayjs()
      const expiresDate = dayjs(loggedUser.value.tokenExpiration)
      const diffMinutes = expiresDate.diff(nowDate, 'minute');
      // console.log('token expiration: minuts',  diffMinutes);
      if (diffMinutes < 10) {
        store.dispatch('auth/REFRESHTOKEN')
      }
    }
    return config
  },
  (error) => {
    throw error
  }
)
caxios.interceptors.response.use((response) => {
  return response;
},
  (error) => {
    if (error.response) {
      console.error("error.response:", error.response);
      console.error("error.response.statusText:", error.response.statusText);
      console.error("error.response?.data?.detail:", error.response?.data?.detail);
      if (error.response?.status === 401) {
        store.dispatch('auth/LOGOUT')
        setTimeout(() => {
          window.location.href = "/login"
        }, 500);
      }
    }
    return Promise.reject(error);
  }
);
export default caxios
