<template>
  <view class="page">
    <!-- 顶部 -->
    <view class="header">
      <view class="back" @click="goBack">
        ‹
      </view>

      <text class="header-title">
        商品详情
      </text>

      <view class="header-placeholder"></view>
    </view>

    <!-- 商品图片 -->
    <view class="product-image">
      <text>{{ product.icon }}</text>
    </view>

    <!-- 商品内容 -->
    <view class="content">
      <!-- 分类 -->
      <text class="category">
        {{ categoryName }}
      </text>

      <!-- 商品名称 + 收藏 -->
      <view class="title-row">
        <text class="name">
          {{ product.name }}
        </text>

        <text
          class="favorite"
          :class="{
            active:
              favoritesStore.isFavorite(
                product.id,
              ),
          }"
          @click="toggleFavorite"
        >
          {{
            favoritesStore.isFavorite(
              product.id,
            )
              ? "♥"
              : "♡"
          }}
        </text>
      </view>

      <!-- 评分 -->
      <view class="rating">
        <text>
          ⭐ {{ product.rating }}
        </text>

        <text>
          {{ product.sales }}人购买
        </text>
      </view>

      <!-- 当前价格 -->
      <text class="price">
        ¥{{ currentPrice }}
      </text>

      <view class="divider"></view>

      <!-- SKU -->
      <view
        v-if="
          product.skuOptions &&
          product.skuOptions.length
        "
        class="sku-section"
      >
        <view
          v-for="option in product.skuOptions"
          :key="option.name"
          class="sku-group"
        >
          <text class="sku-title">
            {{ option.name }}
          </text>

          <view class="sku-values">
            <view
              v-for="value in option.values"
              :key="value"
              class="sku-value"
              :class="{
                active:
                  selectedOptions[
                    option.name
                  ] === value,
              }"
              @click="
                selectSku(
                  option.name,
                  value,
                )
              "
            >
              {{ value }}
            </view>
          </view>
        </view>
      </view>

      <!-- 当前 SKU 信息 -->
      <view
        v-if="currentSku"
        class="stock-row"
      >
        <text>库存</text>

        <text>
          {{ currentSku.stock }}
        </text>
      </view>

      <!-- 数量 -->
      <view class="quantity-row">
        <text class="quantity-title">
          数量
        </text>

        <view class="quantity-control">
          <view
            class="quantity-button"
            :class="{
              disabled:
                quantity <= 1,
            }"
            @click="decreaseQuantity"
          >
            −
          </view>

          <text class="quantity">
            {{ quantity }}
          </text>

          <view
            class="quantity-button"
            :class="{
              disabled:
                currentSku &&
                quantity >=
                  currentSku.stock,
            }"
            @click="increaseQuantity"
          >
            +
          </view>
        </view>
      </view>

      <view class="divider"></view>

      <!-- 服务介绍 -->
      <text class="section-title">
        服务介绍
      </text>

      <text class="description">
        {{ product.description }}
      </text>

      <!-- 服务信息 -->
      <view class="info-item">
        <text>服务保障</text>

        <text>
          ✓ 正品保障　✓ 放心消费
        </text>
      </view>

      <view class="info-item">
        <text>营业时间</text>

        <text>
          {{ product.businessHours }}
        </text>
      </view>

      <view class="info-item">
        <text>服务地址</text>

        <text>
          {{ product.address }}
        </text>
      </view>
    </view>

    <!-- 底部操作 -->
    <view class="bottom-bar">
      <!-- 购物车 -->
      <view
        class="cart-entry"
        @click="goCart"
      >
        <text class="cart-icon">
          🛒
        </text>

        <text>购物车</text>
      </view>

      <!-- 加入购物车 -->
      <button
        class="cart-button"
        @click="addToCart"
      >
        加入购物车
      </button>

      <!-- 立即购买 -->
      <button
        class="buy-button"
        @click="buyNow"
      >
        立即购买
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import {
  computed,
  reactive,
  ref,
} from "vue";

import { onLoad } from "@dcloudio/uni-app";

import { cartStore } from "@/stores/cart";

import { products } from "../../../../shared/data/products";

import type {
  Product,
  ProductSku,
} from "../../../../shared/types/product";

import { categories } from "../../../../shared/data/categories";

import { favoritesStore } from "../../stores/favorites";
import { ordersStore } from "@/stores/orders";
import { authStore } from "@/stores/auth";

/**
 * 当前商品
 */
const product = reactive<Product>({
  ...products[0],
});

/**
 * 当前选择的 SKU
 *
 * 例如：
 *
 * {
 *   套餐: "四人套餐",
 *   口味: "不辣"
 * }
 */
const selectedOptions =
  reactive<
    Record<string, string>
  >({});

/**
 * 当前购买数量
 */
const quantity = ref(1);

/**
 * 根据商品分类 ID 获取分类名称
 */
const categoryName =
  computed(() => {
    const category =
      categories.find(
        (item) =>
          item.id ===
          product.category,
      );

    return (
      category?.name ||
      "未知分类"
    );
  });

/**
 * 当前 SKU
 */
const currentSku =
  computed<ProductSku | null>(
    () => {
      if (
        !product.skus ||
        product.skus.length === 0
      ) {
        return null;
      }

      return (
        product.skus.find(
          (sku) => {
            return product.skuOptions.every(
              (option) =>
                selectedOptions[
                  option.name
                ] ===
                sku.options[
                  option.name
                ],
            );
          },
        ) || null
      );
    },
  );

/**
 * 当前价格
 */
const currentPrice =
  computed(() => {
    return (
      currentSku.value?.price ??
      product.price
    );
  });

/**
 * 初始化 SKU
 *
 * 默认选择每个规格的第一个值
 */
const initSku = () => {
  Object.keys(
    selectedOptions,
  ).forEach((key) => {
    delete selectedOptions[key];
  });

  product.skuOptions.forEach(
    (option) => {
      selectedOptions[
        option.name
      ] = option.values[0];
    },
  );

  quantity.value = 1;
};

/**
 * 加载商品
 */
onLoad((options) => {
  const id = Number(
    options?.id,
  );

  const target =
    products.find(
      (item) =>
        item.id === id,
    );

  if (!target) {
    return;
  }

  Object.assign(
    product,
    target,
  );

  initSku();
});

/**
 * 选择 SKU
 */
const selectSku = (
  name: string,
  value: string,
) => {
  selectedOptions[name] =
    value;

  /**
   * 切换 SKU 后重新从 1 件开始
   */
  quantity.value = 1;
};

/**
 * 增加数量
 */
const increaseQuantity =
  () => {
    const stock =
      currentSku.value?.stock;

    if (
      typeof stock ===
        "number" &&
      quantity.value >=
        stock
    ) {
      uni.showToast({
        title:
          "已达到库存上限",
        icon: "none",
      });

      return;
    }

    quantity.value++;
  };

/**
 * 减少数量
 */
const decreaseQuantity =
  () => {
    if (
      quantity.value <= 1
    ) {
      return;
    }

    quantity.value--;
  };

/**
 * 返回
 */
const goBack = () => {
  uni.navigateBack();
};

/**
 * 购物车
 */
const goCart = () => {
  uni.switchTab({
    url: "/pages/cart/cart",
  });
};

/**
 * 加入购物车
 */
const addToCart = () => {
  /**
   * 没有匹配到 SKU
   */
  if (
    product.skus.length >
      0 &&
    !currentSku.value
  ) {
    uni.showToast({
      title:
        "请选择商品规格",
      icon: "none",
    });

    return;
  }

  /**
   * 没有 SKU 的商品
   */
  const sku =
    currentSku.value;

  const success =
    cartStore.addItem({
      id: product.id,
      name: product.name,
      price: currentPrice.value,
      icon: product.icon,
      skuId:
        sku?.id ||
        "default",
      skuOptions:
        sku?.options || {},
      stock:
        sku?.stock ||
        9999,
      quantity:
        quantity.value,
    });

  if (!success) {
    uni.showToast({
      title:
        "库存不足",
      icon: "none",
    });

    return;
  }

  uni.showToast({
    title:
      "已加入购物车",
    icon: "success",
  });
};

/**
 * 立即购买
 */
/**
 * 立即购买
 */
const buyNow = () => {
  // 未登录
  if (!authStore.isLoggedIn.value) {
    uni.showToast({
      title: "请先登录",
      icon: "none",
    });

    setTimeout(() => {
      uni.reLaunch({
        url: "/pages/login/login",
      });
    }, 300);

    return;
  }

  /**
   * 有 SKU 的商品必须选择有效规格
   */
  if (
    product.skus.length > 0 &&
    !currentSku.value
  ) {
    uni.showToast({
      title: "请选择商品规格",
      icon: "none",
    });

    return;
  }

  const sku = currentSku.value;

  /**
   * 当前商品购买信息
   */
  const buyItem = {
    id: product.id,
    name: product.name,
    price: currentPrice.value,
    icon: product.icon,
    quantity: quantity.value,
    skuId: sku?.id || "default",
    skuOptions: sku?.options || {},
    stock: sku?.stock || 9999,
  };

  /**
   * 直接创建订单
   *
   * 不经过购物车
   */
  const order = ordersStore.createOrder([
    buyItem,
  ]);

  if (!order) {
    uni.showToast({
      title: "订单创建失败",
      icon: "none",
    });

    return;
  }

  uni.showToast({
    title: "订单创建成功",
    icon: "success",
  });

  /**
   * 跳转订单详情
   */
  setTimeout(() => {
    uni.navigateTo({
      url: `/pages/order-detail/order-detail?id=${order.id}`,
    });
  }, 500);
};

/**
 * 收藏
 */
const toggleFavorite =
  () => {
    favoritesStore.toggle(
      product.id,
    );

    uni.showToast({
      title:
        favoritesStore.isFavorite(
          product.id,
        )
          ? "已收藏"
          : "已取消收藏",
      icon: "none",
    });
  };
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding-bottom: 140rpx;
  background: #f5f6f2;
  color: #303a33;
}

/* 顶部 */
.header {
  height: 96rpx;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 32rpx;

  background: #fbfcf9;
}

.back {
  width: 60rpx;

  color: #587160;

  font-size: 60rpx;
  line-height: 1;
}

.header-title {
  font-size: 32rpx;
  font-weight: 600;
}

.header-placeholder {
  width: 60rpx;
}

/* 商品图片 */
.product-image {
  height: 500rpx;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #e8efe9;
}

.product-image text {
  font-size: 180rpx;
}

/* 内容 */
.content {
  margin-top: 20rpx;
  padding: 32rpx;

  background: #fbfcf9;
}

.category {
  display: block;

  margin-bottom: 12rpx;

  color: #6f8f78;

  font-size: 24rpx;
}

/* 商品标题 */
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20rpx;
}

.name {
  flex: 1;

  color: #303a33;

  font-size: 42rpx;
  font-weight: 700;
}

.favorite {
  flex-shrink: 0;

  color: #9aa19b;

  font-size: 54rpx;
}

.favorite.active {
  color: #6f8f78;
}

/* 评分 */
.rating {
  display: flex;
  gap: 24rpx;

  margin-top: 18rpx;

  color: #737a74;

  font-size: 24rpx;
}

/* 价格 */
.price {
  display: block;

  margin-top: 28rpx;

  color: #587160;

  font-size: 48rpx;
  font-weight: 700;
}

/* 分割线 */
.divider {
  height: 1rpx;

  margin: 32rpx 0;

  background: #e1e6e1;
}

/* SKU */
.sku-section {
  margin-bottom: 24rpx;
}

.sku-group {
  margin-bottom: 28rpx;
}

.sku-title {
  display: block;

  margin-bottom: 18rpx;

  color: #303a33;

  font-size: 28rpx;
  font-weight: 600;
}

.sku-values {
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
}

.sku-value {
  min-width: 140rpx;

  padding: 16rpx 24rpx;

  box-sizing: border-box;

  border: 1rpx solid #dfe5df;
  border-radius: 10rpx;

  background: #f5f6f2;

  color: #59635c;

  font-size: 25rpx;

  text-align: center;
}

.sku-value.active {
  border-color: #587160;

  background: #e8efe9;

  color: #587160;

  font-weight: 600;
}

/* 库存 */
.stock-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 22rpx 0;

  color: #737a74;

  font-size: 24rpx;
}

.stock-row text:last-child {
  color: #587160;
}

/* 数量 */
.quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 24rpx 0;
}

.quantity-title {
  color: #303a33;

  font-size: 28rpx;
  font-weight: 600;
}

.quantity-control {
  display: flex;
  align-items: center;

  border: 1rpx solid #dfe5df;
  border-radius: 10rpx;

  overflow: hidden;
}

.quantity-button {
  width: 70rpx;
  height: 64rpx;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f5f6f2;

  color: #587160;

  font-size: 34rpx;
}

.quantity-button.disabled {
  color: #b8beb9;
}

.quantity {
  width: 80rpx;

  text-align: center;

  color: #303a33;

  font-size: 28rpx;
}

/* 服务介绍 */
.section-title {
  display: block;

  margin-bottom: 16rpx;

  font-size: 32rpx;
  font-weight: 600;
}

.description {
  display: block;

  color: #737a74;

  font-size: 26rpx;
  line-height: 1.8;
}

/* 服务信息 */
.info-item {
  display: flex;
  justify-content: space-between;

  gap: 20rpx;

  padding: 24rpx 0;

  border-bottom: 1rpx solid #e8ece8;

  color: #59635c;

  font-size: 24rpx;
}

.info-item text:last-child {
  text-align: right;

  color: #8a918b;
}

/* 底部 */
.bottom-bar {
  position: fixed;

  left: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;

  gap: 12rpx;

  padding: 18rpx 24rpx;

  padding-bottom:
    calc(
      18rpx +
        env(
          safe-area-inset-bottom
        )
    );

  background: #fbfcf9;

  border-top: 1rpx solid #e1e6e1;
}

.cart-entry {
  width: 100rpx;

  display: flex;
  flex-direction: column;
  align-items: center;

  color: #737a74;

  font-size: 20rpx;
}

.cart-icon {
  margin-bottom: 4rpx;

  font-size: 34rpx;
}

.bottom-bar button {
  flex: 1;

  height: 76rpx;

  margin: 0;
  padding: 0;

  border: none;
  border-radius: 12rpx;

  line-height: 76rpx;

  font-size: 27rpx;
}

.bottom-bar button::after {
  border: none;
}

.cart-button {
  background: #e8efe9;

  color: #587160;
}

.buy-button {
  background: #587160;

  color: #ffffff;
}
</style>