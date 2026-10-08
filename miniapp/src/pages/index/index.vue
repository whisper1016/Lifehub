<template>
  <view class="page">
    <!-- 顶部 -->
    <view class="header">
      <view class="logo">LifeHub</view>
      <view class="city">杭州 ▾</view>
    </view>

    <!-- 搜索 -->
    <!-- <view class="search-box">
      <text class="search-icon">⌕</text>
      <input
        v-model="keyword"
        placeholder="搜索生活服务"
        confirm-type="search"
        @confirm="goSearch"
    />
    </view> -->

    <!-- Banner -->
    <view class="banner">
      <view class="banner-content">
        <text class="banner-title">
          发现城市里的美好生活
        </text>

        <text class="banner-desc">
          吃喝玩乐，一站式发现身边的优质服务
        </text>
      </view>
    </view>

    <!-- 分类 -->
    <view class="section">
      <view class="section-title">
        <text>热门分类</text>
        <!-- <text class="more">更多 ›</text> -->
      </view>

      <view class="category-list">
        <view v-for="item in categories" :key="item.id" class="category-item" @click="goCategory(item.id)">
          <view class="category-icon">
            {{ item.icon }}
          </view>

          <text>{{ item.name }}</text>
        </view>
      </view>
    </view>

    <!-- 推荐 -->
    <view class="section">
      <view class="section-title">
        <text>热门推荐</text>
        <text class="more">更多 ›</text>
      </view>

      <view class="service-list">
        <view v-for="item in products" :key="item.id" class="service-card" @click="goDetail(item.id)">
          <view class="service-image">
            {{ item.icon }}
          </view>

          <view class="service-info">
            <text class="service-name">
              {{ item.name }}
            </text>

            <text class="service-desc">
              {{ item.description }}
            </text>

            <view class="service-bottom">
              <text class="price">
                ¥{{ item.price }}
              </text>

              <text class="rating">
                ⭐ {{ item.rating }}
              </text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { cartStore } from "../../stores/cart";
import { products } from "../../../../shared/data/products";

/**
 * 首页热门分类
 * 点击后跳转到分类 Tab
 */
const goCategory = (id: number) => {
  uni.setStorageSync(
    "lifehub-category-id",
    id
  );

  uni.switchTab({
    url: "/pages/category/category",
  });
};

// const goCategory = (id: number) => {
//   uni.setStorageSync("lifehub-category-id", id);

//   uni.switchTab({
//     url: "/pages/category/category",
//   });
// };


onShow(() => {
  setTimeout(() => {
    cartStore.syncBadge();
  }, 100);
});


const categoryId = uni.getStorageSync("lifehub-category-id");
const keyword = ref("");

const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`,
  });
};

const categories = [
  {
    id: 2,
    name: "美食",
    icon: "🍜",
  },
  {
    id: 3,
    name: "酒店",
    icon: "🏨",
  },
  {
    id: 4,
    name: "娱乐",
    icon: "🎮",
  },
  {
    id: 5,
    name: "购物",
    icon: "🛍️",
  },
];

const goSearch = () => {
  const value = keyword.value.trim();

  if (!value) {
    return;
  }

  uni.setStorageSync("lifehub-search-keyword", value);

  uni.switchTab({
    url: "/pages/category/category",
  });
};

</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: 40rpx;
  background: #f5f6f2;
  color: #303a33;
}

/* 顶部 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 32rpx 24rpx;
  background: #fbfcf9;
}

.logo {
  color: #587160;
  font-size: 40rpx;
  font-weight: 700;
}

.city {
  color: #737a74;
  font-size: 26rpx;
}

/* 搜索 */
.search-box {
  display: flex;
  align-items: center;
  margin: 20rpx 32rpx;
  padding: 0 24rpx;
  height: 80rpx;
  background: #ffffff;
  border-radius: 16rpx;
}

.search-icon {
  margin-right: 12rpx;
  color: #8a948d;
  font-size: 36rpx;
}

.search-box input {
  flex: 1;
  font-size: 28rpx;
}

/* Banner */
.banner {
  margin: 0 32rpx;
  padding: 50rpx 36rpx;
  border-radius: 24rpx;
  background: #e8efe9;
}

.banner-content {
  display: flex;
  flex-direction: column;
}

.banner-title {
  max-width: 520rpx;
  color: #486650;
  font-size: 44rpx;
  font-weight: 700;
  line-height: 1.4;
}

.banner-desc {
  margin-top: 20rpx;
  color: #737a74;
  font-size: 26rpx;
  line-height: 1.6;
}

/* 区域 */
.section {
  margin-top: 40rpx;
  padding: 0 32rpx;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
  font-size: 34rpx;
  font-weight: 600;
}

.more {
  color: #8a948d;
  font-size: 24rpx;
  font-weight: 400;
}

/* 分类 */
.category-list {
  display: flex;
  justify-content: space-between;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150rpx;
  padding: 24rpx 0;
  background: #fbfcf9;
  border-radius: 18rpx;
}

.category-icon {
  margin-bottom: 12rpx;
  font-size: 44rpx;
}

.category-item text:last-child {
  color: #4d554f;
  font-size: 26rpx;
}

/* 推荐 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.service-card {
  display: flex;
  padding: 20rpx;
  background: #fbfcf9;
  border-radius: 18rpx;
}

.service-image {
  width: 180rpx;
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 14rpx;
  background: #eef2ed;
  font-size: 72rpx;
}

.service-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 20rpx;
  padding: 6rpx 0;
}

.service-name {
  font-size: 32rpx;
  font-weight: 600;
}

.service-desc {
  margin-top: 8rpx;
  color: #8a918b;
  font-size: 24rpx;
}

.service-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  color: #486650;
  font-size: 34rpx;
  font-weight: 700;
}

.rating {
  color: #737a74;
  font-size: 24rpx;
}
</style>