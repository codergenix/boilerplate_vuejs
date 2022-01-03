/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

import login from '../page/Login'
import User from '../page/User'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: login
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    { 
      path: "*", 
      redirect: "/" 
    }
  ]
})
