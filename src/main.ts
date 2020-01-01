import Vue from 'vue';
// @ts-ignore
import VueMaterial from 'vue-material';
// @ts-ignore
import VueCodeMirror from 'vue-codemirror-lite';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import 'material-design-icons/iconfont/material-icons.css';

Vue.config.productionTip = false;
Vue.use(VueMaterial);
Vue.use(VueCodeMirror);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
