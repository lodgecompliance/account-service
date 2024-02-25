import Vue from 'vue'
import VueMeta from 'vue-meta'
import VueIntercom from 'vue-intercom'
import moment from "moment";
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
// import _apollo from './apollo'
import config from './config';
import filters from './plugins/filters';
import VueTelInputVuetify from 'vue-tel-input-vuetify/lib';
import helper from "@/helper";

Vue.config.productionTip = false
 
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

if(config.intercom.app_id) {
  Vue.use(VueIntercom, { appId: config.intercom.app_id });
}

Vue.use(VueTelInputVuetify,{
    vuetify
})

Vue.prototype.$eventHub = new Vue(); // Global event bus

Vue.mixin({
    methods: {
        url: (path) => `${config.app.url}${path}`,
        convertObjectToMetaKeyValue(obj = {}) {
            return helper.convertObjectToMetaKeyValue(obj)
        },
        convertMetaKeyValueToObj(arr = []) {
            return helper.convertMetaKeyValueToObj(arr)
        },
        updateItemInArray(item, identifier = null, arr = []) {
            const finder = identifier && typeof item === "object"
                ? i => i[identifier] === item[identifier]
                : i => i === item
            const updatedItem = arr.find(finder);
            if(updatedItem) {
                Object.assign(updatedItem, item);
                arr.splice(arr.findIndex(finder), 1, updatedItem)
            }
            return arr;
        }
    }
});

Vue.use(filters);

new Vue({
  router,
  store,
  vuetify,
  // apolloProvider: apollo.provider,
  render: h => h(App)
}).$mount('#app')
