import Vue from 'vue'
import Vuex from 'vuex'

import { Login } from './module/login';
import { User } from './module/User';

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    Login,
    User
  }
})