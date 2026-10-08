<template>
  <view class="page">
    <!-- 用户信息 -->
    <view class="profile-card" @click="handleProfile">
      <view class="avatar">
        👨‍💻
      </view>

      <view class="user-info">
        <text class="name">{{ authStore.user.value?.username || "未登录" }}</text>
        <text class="desc">
          {{ authStore.isLoggedIn.value
            ? "欢迎来到 LifeHub"
            : "登录后享受更多服务" }}
        </text>
      </view>

      <text class="arrow">›</text>
    </view>

    <!-- 数据 -->
    <view class="stats">
      <!-- 订单 -->
      <view class="stat-item" @click="goOrders">
        <text class="number">
          {{ authStore.isLoggedIn.value
            ? ordersStore.orders.length
            : 0 }}
        </text>

        <text class="label">
          我的订单
        </text>
      </view>

      <!-- 收藏 -->
      <view class="stat-item" @click="goFavorites">
        <text class="number">
          {{ authStore.isLoggedIn.value
            ? favoritesStore.count
            : 0 }}
        </text>

        <text class="label">
          我的收藏
        </text>
      </view>

      <!-- 优惠券 -->
      <view class="stat-item" @click="showComingSoon('优惠券')">
        <text class="number">
          {{ authStore.isLoggedIn.value ? 3 : 0 }}
        </text>

        <text class="label">
          优惠券
        </text>
      </view>

      <!-- 浏览记录 -->
      <view class="stat-item" @click="showComingSoon('浏览记录')">
        <text class="number">
          {{ authStore.isLoggedIn.value ? 8 : 0 }}
        </text>

        <text class="label">
          浏览记录
        </text>
      </view>
    </view>

    <!-- 我的服务 -->
    <view class="section">
      <text class="section-title">
        我的服务
      </text>

      <view class="menu-list">
        <!-- 我的订单 -->
        <view class="menu-item" @click="goOrders">
          <view class="menu-left">
            <text class="menu-icon">
              📦
            </text>

            <view>
              <text class="menu-name">
                我的订单
              </text>

              <text class="menu-desc">
                查看全部订单
              </text>
            </view>
          </view>

          <text class="arrow">›</text>
        </view>

        <!-- 我的收藏 -->
        <view class="menu-item" @click="goFavorites">
          <view class="menu-left">
            <text class="menu-icon">
              ❤️
            </text>

            <view>
              <text class="menu-name">
                我的收藏
              </text>

              <text class="menu-desc">
                查看收藏的商品和服务
              </text>
            </view>
          </view>

          <text class="arrow">›</text>
        </view>

        <!-- 优惠券 -->
        <view class="menu-item" @click="showComingSoon('优惠券')">
          <view class="menu-left">
            <text class="menu-icon">
              🎟️
            </text>

            <view>
              <text class="menu-name">
                优惠券
              </text>

              <text class="menu-desc">
                查看可使用的优惠券
              </text>
            </view>
          </view>

          <text class="arrow">›</text>
        </view>

        <!-- 账号设置 -->
        <view class="menu-item" @click="showComingSoon('账号设置')">
          <view class="menu-left">
            <text class="menu-icon">
              ⚙️
            </text>

            <view>
              <text class="menu-name">
                账号设置
              </text>

              <text class="menu-desc">
                管理账号和个人信息
              </text>
            </view>
          </view>

          <text class="arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <button
  v-if="authStore.isLoggedIn.value"
  class="logout"
  @click="logout"
>
  退出登录
</button>
  </view>
</template>

<script setup lang="ts">
import { ordersStore } from "../../stores/orders";
import { favoritesStore } from "../../stores/favorites";
import { authStore } from "../../stores/auth";
import { cartStore } from "../../stores/cart";

/**
 * 我的订单
 */
const goOrders = () => {
  if (!authStore.isLoggedIn.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });

    return;
  }

  uni.switchTab({
    url: "/pages/orders/orders",
  });
};

/**
 * 我的收藏
 */
const goFavorites = () => {
  if (!authStore.isLoggedIn.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });

    return;
  }

  uni.navigateTo({
    url: "/pages/favorites/favorites",
  });
};

/**
 * 用户信息
 */
const handleProfile = () => {
  if (authStore.isLoggedIn.value) {
    uni.showToast({
      title: `当前账号：${authStore.user.value?.username}`,
      icon: "none",
    });

    return;
  }

  uni.navigateTo({
    url: "/pages/login/login",
  });
};

/**
 * 暂未开发功能
 */
const showComingSoon = (name: string) => {
  if (!authStore.isLoggedIn.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });

    return;
  }

  uni.showToast({
    title: `${name}功能开发中`,
    icon: "none",
  });
};

/**
 * 退出登录
 */
const logout = () => {
  if (!authStore.isLoggedIn.value) {
    uni.navigateTo({
      url: "/pages/login/login",
    });

    return;
  }

  uni.showModal({
    title: "退出登录",
    content: "确定要退出当前账号吗？",
    success: (res) => {
      if (!res.confirm) return;

      // 清空当前会话购物车
      cartStore.clear();

      // 清空内存中的订单
      // 不删除账号订单数据
      ordersStore.logoutClear();

      // 刷新收藏状态
      favoritesStore.reload();

      // 退出登录
      authStore.logout();

      uni.showToast({
        title: "已退出登录",
        icon: "success",
      });
    },
  });
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 32rpx 50rpx;
  background: #f5f6f2;
}

/* 用户 */

.profile-card {
  display: flex;
  align-items: center;
  padding: 28rpx;
  background: #fbfcf9;
  border-radius: 20rpx;
}

.avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90rpx;
  height: 90rpx;
  flex-shrink: 0;
  border-radius: 50%;
  background: #e8efe9;
  font-size: 44rpx;
}

.user-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 20rpx;
}

.name {
  color: #303a33;
  font-size: 34rpx;
  font-weight: 600;
}

.desc {
  margin-top: 8rpx;
  color: #8a918b;
  font-size: 24rpx;
}

.profile-card .arrow {
  color: #9aa19b;
  font-size: 42rpx;
}

/* 数据 */

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-top: 20rpx;
  padding: 24rpx 0;
  background: #fbfcf9;
  border-radius: 18rpx;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.number {
  color: #587160;
  font-size: 34rpx;
  font-weight: 700;
}

.label {
  margin-top: 8rpx;
  color: #737a74;
  font-size: 21rpx;
}

/* 服务 */

.section {
  margin-top: 36rpx;
}

.section-title {
  display: block;
  margin-bottom: 20rpx;
  color: #303a33;
  font-size: 32rpx;
  font-weight: 600;
}

.menu-list {
  overflow: hidden;
  background: #fbfcf9;
  border-radius: 18rpx;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid #e5e9e5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  background: #eef2ed;
  font-size: 30rpx;
}

.menu-left view {
  display: flex;
  flex-direction: column;
  margin-left: 18rpx;
}

.menu-name {
  color: #303a33;
  font-size: 27rpx;
}

.menu-desc {
  margin-top: 6rpx;
  color: #9aa19b;
  font-size: 21rpx;
}

.arrow {
  color: #9aa19b;
  font-size: 42rpx;
}

/* 退出 */

.logout {
  width: 100%;
  margin-top: 28rpx;
  padding: 0;
  border: 1rpx solid #e1e6e1;
  border-radius: 12rpx;
  background: #fbfcf9;
  color: #737a74;
  font-size: 26rpx;
  line-height: 78rpx;
}

.logout::after {
  border: none;
}
</style>