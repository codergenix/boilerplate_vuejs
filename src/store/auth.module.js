import AuthService from '@/services/auth.service'
// --
const storedUser = JSON.parse(sessionStorage.getItem('webAppUser'))
// ---
export default {
  namespaced: true,
  state: {
    status: { loggedIn: !!storedUser },
    user: storedUser || null,
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true
      state.user = user
    },
    loginFailure(state) {
      state.status.loggedIn = false
      state.user = null
    },
    signupSuccess(state, user) {
      state.status.loggedIn = false
      state.user = user
    },
    refreshToken(state, data) {
      state.user.token = data.jwtToken
      state.user.tokenExpiration = data.jwtExpiration
    },
    logout(state) {
      state.status.loggedIn = false
      state.user = null
    }
  },
  actions: {
    REFRESHTOKEN({ commit }) {
      return AuthService.refreshToken().then(
        (response) => {
          commit('refreshToken', response)
          return Promise.resolve(response)
        }, (error) => {
          return Promise.reject(error)
        }
      )
    },
    LOGIN({ commit }, userInfo) {
      return AuthService.login(userInfo).then(
        (response) => {
          commit('loginSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('loginFailure')
          return Promise.reject(error)
        }
      )
    },
    SIGN_UP({ commit }, userInfo) {
      return AuthService.signup(userInfo).then(
        (response) => {
          commit('signupSuccess', response)
          return Promise.resolve(response)
        },
        (error) => {
          commit('signupFailure')
          return Promise.reject(error)
        }
      )
    },
    LOGOUT({ commit }) {
      AuthService.logout()
      commit('logout')
    },
    UPDATE_USER_FROM_STORAGE({ commit }, userInfo) {
      commit('loginSuccess', userInfo);
    }
  }
}
