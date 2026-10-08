<template>
  <view class="page">
    <view class="header">
      <text class="title">我的收藏</text>

      <text class="count">
        {{ favoritesStore.count }} 个收藏
      </text>
    </view>

    <view
      v-if="favoriteProducts.length === 0"
      class="empty"
    >
      <text class="empty-icon">♡</text>
      <text class="empty-text">
        还没有收藏任何商品
      </text>
    </view>

    <view v-else class="list">
      <view
        v-for="item in favoriteProducts"
        :key="item.id"
        class="card"
        @click="goDetail(item.id)"
      >
        <view class="image">
          <text>{{ item.icon }}</text>
        </view>

        <view class="info">
          <text class="name">
            {{ item.name }}
          </text>

          <text class="description">
            {{ item.description }}
          </text>

          <view class="bottom">
            <text class="price">
              ¥{{ item.price }}
            </text>

            <text class="rating">
              ⭐ {{ item.rating }}
            </text>
          </view>
        </view>

        <text
          class="remove"
          @click.stop="removeFavorite(item.id)"
        >
          ♥
        </text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { products } from "../../../../shared/data/products";
import { favoritesStore } from "../../stores/favorites";
import { onShow } from "@dcloudio/uni-app";
import { authStore } from "../../stores/auth";

onShow(() => {
  if (!authStore.isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });

    setTimeout(() => {
      uni.navigateTo({
        url: "/pages/login/login",
      });
    }, 300);

    return;
  }

  // 已登录时刷新收藏
  favoritesStore.reload();
});

const favoriteProducts = computed(() => {
  return products.filter((item) =>
    favoritesStore.ids.includes(item.id),
  );
});


const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`,
  });
};

const removeFavorite = (id: number) => {
  favoritesStore.toggle(id);
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 32rpx 50rpx;
  background: #f5f6f2;
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.title {
  color: #303a33;
  font-size: 46rpx;
  font-weight: 700;
}

.count {
  color: #8a918b;
  font-size: 24rpx;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.card {
  position: relative;

  display: flex;
  padding: 20rpx;

  border-radius: 18rpx;
  background: #fbfcf9;
}

.image {
  width: 170rpx;
  height: 170rpx;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 14rpx;
  background: #eef2ed;
}

.image text {
  font-size: 72rpx;
}

.info {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-left: 20rpx;
  padding-right: 50rpx;
}

.name {
  color: #303a33;
  font-size: 30rpx;
  font-weight: 600;
}

.description {
  margin-top: 10rpx;
  color: #8a918b;
  font-size: 24rpx;
  line-height: 1.5;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
}

.price {
  color: #587160;
  font-size: 34rpx;
  font-weight: 700;
}

.rating {
  color: #737a74;
  font-size: 23rpx;
}

.remove {
  position: absolute;
  top: 20rpx;
  right: 24rpx;

  color: #6f8f78;
  font-size: 38rpx;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 180rpx 0;
}

.empty-icon {
  color: #9aa19b;
  font-size: 100rpx;
}

.empty-text {
  margin-top: 20rpx;
  color: #8a918b;
  font-size: 26rpx;
}
</style>