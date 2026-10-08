<template>
  <header class="header">
    <router-link to="/" class="logo">
      LifeHub
    </router-link>

    <nav class="nav">
      <!-- 首页 -->
      <router-link to="/">
        首页
      </router-link>

      <!-- 分类 -->
      <router-link to="/category">
        分类
      </router-link>

      <!-- 购物车 -->
      <router-link
        to="/cart"
        class="cart-link"
      >
        <span>购物车</span>

        <span
          v-if="cartStore.totalCount > 0"
          class="cart-badge"
        >
          {{
            cartStore.totalCount > 99
              ? "99+"
              : cartStore.totalCount
          }}
        </span>
      </router-link>

      <!-- 订单 -->
      <router-link to="/orders">
        订单
      </router-link>

      <!-- 已登录：显示我的 -->
      <router-link
        v-if="authStore.isLoggedIn"
        to="/profile"
      >
        我的
      </router-link>

      <!-- 未登录：显示登录 -->
      <router-link
        v-else
        to="/login"
        class="login-link"
      >
        登录
      </router-link>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from "../stores/cart";
import { useAuthStore } from "../stores/auth";

const cartStore = useCartStore();
const authStore = useAuthStore();
</script>

<style>
.cart-link {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.cart-badge {
  position: absolute;
  top: -10px;
  right: -18px;

  min-width: 18px;
  height: 18px;
  padding: 0 5px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 999px;

  background: #587160;
  color: #fff;

  font-size: 11px;
  line-height: 18px;
}

.login-link {
  font-weight: 600;
}
</style>