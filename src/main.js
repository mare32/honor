import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { ValidationProvider} from 'vee-validate/dist/vee-validate.full';
import { ValidationObserver} from 'vee-validate';
Vue.config.productionTip = false

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
