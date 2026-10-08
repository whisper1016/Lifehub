<template>
  <view class="page">
    <!-- 顶部 -->
    <view class="header">
      <text class="title">分类</text>
      <text class="subtitle">发现更多生活服务</text>
    </view>
    <view class="search-box">
      <text class="search-icon">🔍</text>

      <input v-model="keyword" placeholder="搜索生活服务" confirm-type="search" />

      <text v-if="keyword" class="clear" @click="keyword = ''">
        ×
      </text>
    </view>
    <view v-if="keyword" class="search-result">
      搜索「{{ keyword }}」的结果
    </view>

    <!-- 分类 -->
    <view class="category-list">
      <button v-for="item in categories" :key="item.id" class="category-item"
        :class="{ active: activeCategory === item.id }" @click="selectCategory(item.id)">
        <text class="icon">{{ item.icon }}</text>
        <text class="name">{{ item.name }}</text>
      </button>
    </view>

    <!-- 服务列表 -->
    <!-- 服务列表 -->
    <view v-if="filteredServices.length > 0" class="service-list">
      <view v-for="item in filteredServices" :key="item.id" class="service-card" @click="goDetail(item.id)">
        <view class="service-image">
          <text>{{ item.icon }}</text>
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

    <!-- 无搜索结果 -->
    <view v-else class="empty-result">
      <text class="empty-icon">🔍</text>

      <text class="empty-title">
        没有找到相关服务
      </text>

      <text class="empty-desc">
        换个关键词试试看
      </text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { cartStore } from "../../stores/cart";
import {
  products,
  searchProducts,
} from "../../../../shared/data/products";

const activeCategory = ref(1);
const keyword = ref("");

/**
 * 分类数据
 *
 * 1 = 全部
 * 2 = 美食
 * 3 = 酒店
 * 4 = 娱乐
 * 5 = 购物
 */
const categories = [
  {
    id: 1,
    name: "全部",
    icon: "✨",
  },
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

/**
 * 页面显示
 */
onShow(() => {
  setTimeout(() => {
    cartStore.syncBadge();
  }, 100);

  /**
   * 检查是否有来自首页的分类跳转
   */
  const categoryId = uni.getStorageSync(
    "lifehub-category-id"
  );

  if (categoryId) {
    const id = Number(categoryId);

    /**
     * 确认分类 ID 是否存在
     */
    const exists = categories.some(
      (item) => item.id === id
    );

    if (exists) {
      activeCategory.value = id;

      /**
       * 处理完成后立即删除
       * 避免下次进入分类页时重复使用
       */
      uni.removeStorageSync(
        "lifehub-category-id"
      );
    }
  }

  /**
   * 首页搜索关键词
   *
   * 如果以后需要恢复首页搜索，
   * 可以继续使用这里的逻辑。
   */
  // const searchKeyword = uni.getStorageSync(
  //   "lifehub-search-keyword"
  // );

  // if (searchKeyword) {
  //   keyword.value = searchKeyword;

  //   uni.removeStorageSync(
  //     "lifehub-search-keyword"
  //   );
  // }
});

/**
 * 搜索关键词变化
 *
 * 输入搜索关键词后，自动切换到“全部”
 */
watch(keyword, () => {
  if (keyword.value.trim()) {
    activeCategory.value = 1;
  }
});

/**
 * 点击分类
 */
const selectCategory = (id: number) => {
  activeCategory.value = id;

  /**
   * 如果用户手动点击分类，
   * 清除可能残留的首页分类跳转参数
   */
  uni.removeStorageSync(
    "lifehub-category-id"
  );
};

/**
 * 商品详情
 */
const goDetail = (id: number) => {
  uni.navigateTo({
    url: `/pages/detail/detail?id=${id}`,
  });
};

/**
 * 商品筛选
 */
const filteredServices = computed(() => {
  const searchKeyword = keyword.value.trim();

  let result = products;

  /**
   * 关键词搜索
   */
  if (searchKeyword) {
    result = searchProducts(searchKeyword);
  }

  /**
   * 分类筛选
   *
   * 1 = 全部，不进行分类过滤
   */
  if (activeCategory.value !== 1) {
    result = result.filter(
      (item) =>
        item.category === activeCategory.value
    );
  }

  return result;
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 32rpx 50rpx;
  background: #f5f6f2;
}

/* 顶部 */
.header {
  margin-bottom: 32rpx;
}

.title {
  display: block;
  color: #303a33;
  font-size: 46rpx;
  font-weight: 700;
}

.subtitle {
  display: block;
  margin-top: 10rpx;
  color: #8a918b;
  font-size: 26rpx;
}

/* 分类 */
.category-list {
  display: flex;
  gap: 18rpx;
  margin-bottom: 34rpx;

  overflow-x: auto;
  white-space: nowrap;
}

.category-item {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 130rpx;
  height: 130rpx;
  padding: 0;

  border: none;
  border-radius: 18rpx;
  background: #fbfcf9;

  color: #59635c;
  font-size: 24rpx;
  font-weight: normal;
}

.category-item::after {
  border: none;
}

.category-item.active {
  background: #e8efe9;
}

.icon {
  font-size: 42rpx;
}

.name {
  margin-top: 10rpx;
  color: #59635c;
  font-size: 24rpx;
}

.category-item.active .name {
  color: #587160;
  font-weight: 600;
}

/* 服务 */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
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
}

.service-name {
  font-size: 30rpx;
  font-weight: 600;
}

.service-desc {
  margin-top: 8rpx;
  color: #8a918b;
  font-size: 24rpx;
  line-height: 1.5;
}

.service-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.search-box {
  display: flex;
  align-items: center;

  height: 78rpx;
  margin-bottom: 28rpx;
  padding: 0 24rpx;

  background: #fbfcf9;
  border-radius: 16rpx;
}

.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}

.search-box input {
  flex: 1;
  height: 100%;
  color: #303a33;
  font-size: 26rpx;
}

.clear {
  padding-left: 16rpx;
  color: #9aa19b;
  font-size: 36rpx;
}

.search-result {
  margin-bottom: 24rpx;
  color: #737a74;
  font-size: 24rpx;
}


.empty-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 120rpx 30rpx;

  background: #fbfcf9;
  border-radius: 20rpx;
}

.empty-icon {
  font-size: 64rpx;
  opacity: 0.7;
}

.empty-title {
  margin-top: 20rpx;
  color: #59635c;
  font-size: 28rpx;
  font-weight: 600;
}

.empty-desc {
  margin-top: 10rpx;
  color: #9aa19b;
  font-size: 23rpx;
}
</style>