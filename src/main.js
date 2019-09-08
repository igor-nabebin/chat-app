import Vue from 'vue'
import router from './router'
import VueSocketIO from 'vue-socket.io'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App'

Vue.use(
  new VueSocketIO({
    debug: false,
    connection: 'https://demo-chat-server.on.ag/',
  })
)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDmSPTWgBHcmwmqyEDzkDyzfCCWlHqZ8jE',
  },
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
