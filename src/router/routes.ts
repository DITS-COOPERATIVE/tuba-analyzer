import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'connection',
        name: 'connection',
        component: () => import('pages/ConnectionPage.vue')
      },
      {
        path: 'test-page',
        name: 'test',
        component: () => import('pages/TestPage.vue')
      },
      {
        path: 'result',
        name: 'result',
        component: () => import('pages/ResultPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
