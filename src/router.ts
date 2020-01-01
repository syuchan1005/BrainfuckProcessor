import Vue from 'vue';
import Router from 'vue-router';
import Encode from '@/views/Encode.vue';
import Decode from '@/views/Decode.vue';
import Setting from '@/views/Setting.vue';

Vue.use(Router);

// @ts-ignore
export default new Router({
  routes: [
    {
      path: '/encode',
      alias: '/',
      name: 'Encode',
      component: Encode,
    },
    {
      path: '/decode',
      name: 'Decode',
      component: Decode,
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
    },
  ],
});
