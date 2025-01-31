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
        path: 'test-page',
        name: 'test',
        component: () => import('pages/TestPage.vue')
      },
      {
        path: 'result',
        name: 'result',
        component: () => import('pages/ResultPage.vue')
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: () => import('pages/InventoryPage.vue')
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
