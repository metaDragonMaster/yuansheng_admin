import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import "./directive/index.js"
import Element from 'element-ui'
import './styles/element-variables.scss'
import axios from "axios";
Vue.prototype.$axios = axios;
import '@/styles/index.scss'; // global css
import VueParticles from 'vue-particles';
Vue.use(VueParticles);

import App from './App'
import store from './store'
import router from './router'

import FormMixin from "./utils/formMixin.js"

import './icons' // icon
import './permission' // permission control
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.mixin(FormMixin);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
