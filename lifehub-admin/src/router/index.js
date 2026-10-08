import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },

    {
      path: '/dashboard',
      component: () => import('../views/dashboard/Dashboard.vue'),
    },

    {
      path: '/products',
      component: () => import('../views/products/Products.vue'),
    },

    {
      path: '/orders',
      component: () => import('../views/orders/Orders.vue'),
    },

    {
      path: '/customers',
      component: () => import('../views/customers/Customers.vue'),
    },

    {
      path: '/settings',
      component: () => import('../views/settings/Settings.vue'),
    },
  ],
})

export default router