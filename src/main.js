import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//Darcy plugin
import Darcy from './plugins/Darcy';

//Styles
import './assets/styles/index.css';

Vue.config.productionTip = false

Vue.use(Darcy);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
