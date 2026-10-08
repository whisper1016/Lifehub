<template>
  <view class="page">
    <!-- 页面标题 -->
    <view class="header">
      <view>
        <text class="title">购物车</text>

        <text class="count">
          {{ cartStore.totalCount }} 件商品
        </text>
      </view>
    </view>

    <!-- 空购物车 -->
    <view
      v-if="cartStore.items.length === 0"
      class="empty"
    >
      <text class="empty-icon">🛒</text>

      <text class="empty-text">
        购物车还是空的
      </text>

      <text class="empty-tip">
        去首页看看有没有喜欢的商品
      </text>

      <button
        class="go-home"
        @click="goHome"
      >
        去逛逛
      </button>
    </view>

    <!-- 商品列表 -->
    <view
      v-else
      class="cart-list"
    >
      <view
        v-for="item in cartStore.items"
        :key="`${item.id}-${item.skuId}`"
        class="cart-item"
      >
        <!-- 商品图标 -->
        <view class="product-icon">
          <text>{{ item.icon }}</text>
        </view>

        <!-- 商品信息 -->
        <view class="product-info">
          <text class="product-name">
            {{ item.name }}
          </text>

          <!-- SKU -->
          <view
            v-if="Object.keys(item.skuOptions).length"
            class="sku-info"
          >
            <text
              v-for="(value, name) in item.skuOptions"
              :key="name"
              class="sku-text"
            >
              {{ name }}：{{ value }}
            </text>
          </view>

          <!-- 库存 -->
          <text class="stock">
            库存 {{ item.stock }}
          </text>

          <!-- 价格 + 数量 -->
          <view class="price-row">
            <text class="product-price">
              ¥{{ item.price }}
            </text>

            <view class="quantity">
              <button
                class="quantity-button"
                :class="{
                  disabled: item.quantity <= 1
                }"
                @click="
                  cartStore.decrease(
                    item.id,
                    item.skuId
                  )
                "
              >
                −
              </button>

              <text class="quantity-number">
                {{ item.quantity }}
              </text>

              <button
                class="quantity-button"
                :class="{
                  disabled:
                    item.quantity >= item.stock
                }"
                @click="
                  handleIncrease(item.id, item.skuId)
                "
              >
                +
              </button>
            </view>
          </view>

          <!-- 删除 -->
          <text
            class="remove"
            @click="
              removeItem(
                item.id,
                item.skuId
              )
            "
          >
            删除
          </text>
        </view>
      </view>
    </view>

    <!-- 底部结算 -->
    <view class="bottom-bar">
      <view class="total">
        <text class="total-label">
          合计
        </text>

        <text class="total-price">
          ¥{{ cartStore.totalPrice }}
        </text>
      </view>

      <button
        class="checkout"
        :class="{
          disabled:
            cartStore.items.length === 0
        }"
        @click="checkout"
      >
        去结算
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { cartStore } from "@/stores/cart";
import { ordersStore } from "@/stores/orders";
import { authStore } from "@/stores/auth";

/**
 * 页面显示时同步购物车角标
 */
onShow(() => {
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
  }
});

/**
 * 增加商品数量
 */
const handleIncrease = (
  id: number,
  skuId: string
) => {
  const item = cartStore.items.find(
    (item) =>
      item.id === id &&
      item.skuId === skuId
  );

  if (!item) return;

  if (item.quantity >= item.stock) {
    uni.showToast({
      title: "已达到库存上限",
      icon: "none",
    });

    return;
  }

  cartStore.increase(
    id,
    skuId
  );
};

/**
 * 删除商品
 */
const removeItem = (
  id: number,
  skuId: string
) => {
  uni.showModal({
    title: "删除商品",
    content: "确定要删除这个商品吗？",
    success: (res) => {
      if (!res.confirm) return;

      cartStore.removeItem(
        id,
        skuId
      );

      uni.showToast({
        title: "已删除",
        icon: "none",
      });
    },
  });
};

/**
 * 返回首页
 */
const goHome = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};

/**
 * 去结算
 */
const checkout = () => {
  // 未登录
  if (!authStore.isLoggedIn.value) {
    uni.reLaunch({
      url: "/pages/login/login",
    });

    return;
  }

  // 购物车为空
  if (cartStore.items.length === 0) {
    uni.showToast({
      title: "购物车是空的",
      icon: "none",
    });

    return;
  }

  /**
   * 创建订单
   *
   * 深拷贝购物车数据，
   * 避免清空购物车后订单数据受到影响。
   */
  const orderItems = JSON.parse(
    JSON.stringify(cartStore.items)
  );

  ordersStore.createOrder(orderItems);

  /**
   * 创建订单后清空购物车
   */
  cartStore.clear();

  uni.showToast({
    title: "订单创建成功",
    icon: "success",
  });

  /**
   * 跳转订单 TabBar
   */
  setTimeout(() => {
    uni.switchTab({
      url: "/pages/orders/orders",
    });
  }, 500);
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 36rpx 32rpx 260rpx;
  background: #f5f6f2;
}

/* =========================
   Header
========================= */

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
  display: block;
  margin-top: 8rpx;
  color: #8a918b;
  font-size: 24rpx;
}

/* =========================
   Cart List
========================= */

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.cart-item {
  display: flex;
  padding: 20rpx;
  border-radius: 18rpx;
  background: #fbfcf9;
  box-shadow: 0 4rpx 16rpx rgba(48, 58, 51, 0.04);
}

/* =========================
   Product Icon
========================= */

.product-icon {
  width: 150rpx;
  height: 150rpx;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 14rpx;
  background: #eef2ed;
}

.product-icon text {
  font-size: 68rpx;
}

/* =========================
   Product Info
========================= */

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  margin-left: 20rpx;
}

.product-name {
  color: #303a33;
  font-size: 30rpx;
  font-weight: 600;
}

.sku-info {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 10rpx;
}

.sku-text {
  padding: 6rpx 10rpx;
  border-radius: 8rpx;
  background: #eef2ed;
  color: #68746c;
  font-size: 21rpx;
}

.stock {
  margin-top: 8rpx;
  color: #9aa19b;
  font-size: 21rpx;
}

/* =========================
   Price + Quantity
========================= */

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
}

.product-price {
  color: #587160;
  font-size: 34rpx;
  font-weight: 700;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.quantity-button {
  width: 54rpx;
  height: 54rpx;
  margin: 0;
  padding: 0;

  border: none;
  border-radius: 10rpx;

  background: #e8efe9;
  color: #587160;

  line-height: 54rpx;
  font-size: 32rpx;
}

.quantity-button::after {
  border: none;
}

.quantity-button.disabled {
  opacity: 0.45;
}

.quantity-number {
  min-width: 36rpx;
  color: #303a33;
  text-align: center;
  font-size: 26rpx;
}

/* =========================
   Remove
========================= */

.remove {
  align-self: flex-end;
  margin-top: 14rpx;
  color: #9aa19b;
  font-size: 22rpx;
}

/* =========================
   Empty
========================= */

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-icon {
  font-size: 100rpx;
}

.empty-text {
  margin-top: 20rpx;
  color: #68746c;
  font-size: 28rpx;
}

.empty-tip {
  margin-top: 10rpx;
  color: #9aa19b;
  font-size: 23rpx;
}

.go-home {
  width: 220rpx;
  height: 70rpx;
  margin-top: 30rpx;
  padding: 0;

  border: none;
  border-radius: 12rpx;

  background: #587160;
  color: #ffffff;

  line-height: 70rpx;
  font-size: 26rpx;
}

.go-home::after {
  border: none;
}

/* =========================
   Bottom Bar
========================= */

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  transform: translateY(0);

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 20rpx 32rpx;

  background: #fbfcf9;
  border-top: 1rpx solid #e1e6e1;
  box-shadow: 0 -4rpx 16rpx rgba(48, 58, 51, 0.04);
}

.total {
  display: flex;
  flex-direction: column;
}

.total-label {
  color: #8a918b;
  font-size: 22rpx;
}

.total-price {
  margin-top: 4rpx;
  color: #587160;
  font-size: 38rpx;
  font-weight: 700;
}

.checkout {
  width: 220rpx;
  height: 76rpx;
  margin: 0;
  padding: 0;

  border: none;
  border-radius: 12rpx;

  background: #587160;
  color: #ffffff;

  line-height: 76rpx;
  font-size: 28rpx;
}

.checkout::after {
  border: none;
}

.checkout.disabled {
  opacity: 0.5;
}
</style>