// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Antd from 'ant-design-vue';
import SimpleVueValidation from 'simple-vue-validator';

import 'ant-design-vue/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/main.css';

import {store} from './store';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
//Vue.config.devtools = false;

Vue.use(Antd);
Vue.use(SimpleVueValidation);

/* eslint-disable no-new */
/* eslint-disable*/
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
