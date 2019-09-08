import Vue from 'vue'
import Router from 'vue-router'
import LoginPage from './components/LoginPage'
import ChatPage from './components/ChatPage'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'loginPage',
      component: LoginPage,
      meta: {
        middleware: {
          guest: true,
        },
      },
    },
    {
      path: '',
      name: 'chatPage',
      component: ChatPage,
      meta: {
        middleware: {
          requiresAuth: true,
        },
      },
    },
  ],
  mode: 'history',
})

router.beforeEach((to, from, next) => {
  if (
    to.matched.some(
      record => record.meta.middleware && record.meta.middleware.requiresAuth
    )
  ) {
    if (localStorage.getItem('token') === null) {
      next({
        name: 'loginPage',
        params: { redirectURL: to.fullPath },
      })
    } else {
      next()
    }
  } else if (
    to.matched.some(
      record => record.meta.middleware && record.meta.middleware.guest
    )
  ) {
    if (localStorage.getItem('token') === null) {
      next()
    } else {
      next({ name: 'chatPage' })
    }
  } else {
    next()
  }
})

export default router
