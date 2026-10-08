import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import Category from "../views/Category.vue";
import Orders from "../views/Orders.vue";
import OrderDetail from "../views/OrderDetail.vue";
import Profile from "../views/Profile.vue";
import Favorites from "../views/Favorites.vue";
import Detail from "../views/Detail.vue";
import Cart from "../views/Cart.vue";

import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(),

  routes: [
    {
      path: "/",
      name: "Home",
      component: Home
    },

    {
      path: "/category",
      name: "Category",
      component: Category
    },

    {
      path: "/orders",
      name: "Orders",
      component: Orders,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/order/:id",
      name: "OrderDetail",
      component: OrderDetail,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/favorites",
      name: "Favorites",
      component: Favorites,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/detail/:id",
      name: "Detail",
      component: Detail
    },

    {
      path: "/cart",
      name: "Cart",
      component: Cart,
      meta: {
        requiresAuth: true
      }
    },

    {
      path: "/login",
      name: "Login",
      component: () => import("../views/Login.vue")
    }
  ]
});

/**
 * 路由守卫
 *
 * requiresAuth === true
 * 表示这个页面必须登录才能访问
 */
router.beforeEach((to) => {
  const authStore = useAuthStore();

  // 需要登录，但当前没有登录
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return {
      path: "/login",
      query: {
        redirect: to.fullPath
      }
    };
  }

  // 已经登录的用户，不需要再次进入登录页
  if (to.path === "/login" && authStore.isLoggedIn) {
    return "/";
  }

  return true;
});

export default router;