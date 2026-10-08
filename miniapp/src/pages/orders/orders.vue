<template>
  <view class="page">
    <!-- 页面标题 -->
    <view class="header">
      <text class="title">我的订单</text>
      <text class="count">
        共 {{ ordersStore.orders.length }} 个订单
      </text>
    </view>

    <!-- 状态筛选 -->
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.value" class="tab" :class="{ active: currentTab === tab.value }"
        @click="currentTab = tab.value">
        <text>{{ tab.label }}</text>
      </view>
    </view>

    <!-- 空订单 -->
    <view v-if="filteredOrders.length === 0" class="empty">
      <text class="empty-icon">📦</text>

      <text class="empty-title">
        {{ emptyText }}
      </text>

      <text class="empty-tip">
        去首页看看有没有喜欢的商品
      </text>

      <button class="go-home" @click="goHome">
        去逛逛
      </button>
    </view>

    <!-- 订单列表 -->
    <view v-else class="order-list">
      <view v-for="order in filteredOrders" :key="order.id" class="order-card" @click="openOrder(order.id)">
        <!-- 订单头部 -->
        <view class="order-header">
          <text class="order-id">
            {{ order.id }}
          </text>

          <text class="order-status" :class="`status-${order.status}`">
            {{ order.statusText }}
          </text>
        </view>

        <!-- 商品 -->
        <view v-for="item in order.items" :key="`${order.id}-${item.id}-${item.skuId || 'default'}`"
          class="product-item">
          <view class="product-icon">
            <text>{{ item.icon }}</text>
          </view>

          <view class="product-info">
            <text class="product-name">
              {{ item.name }}
            </text>

            <!-- SKU -->
            <view v-if="
              item.skuOptions &&
              Object.keys(item.skuOptions).length
            " class="sku-list">
              <text v-for="(value, name) in item.skuOptions" :key="name" class="sku-tag">
                {{ name }}：{{ value }}
              </text>
            </view>

            <view class="product-bottom">
              <text class="price">
                ¥{{ item.price }}
              </text>

              <text class="quantity">
                × {{ item.quantity }}
              </text>
            </view>
          </view>
        </view>

        <!-- 订单底部 -->
        <view class="order-footer">
          <view>
            <text class="total-count">
              共 {{ order.totalCount }} 件
            </text>

            <text class="total-label">
              合计
            </text>

            <text class="total-price">
              ¥{{ order.totalPrice }}
            </text>
          </view>

          <view class="order-actions">
            <!-- 待付款 -->
            <button v-if="order.status === 'pending'" class="pay-button" @click.stop="payOrder(order.id)">
              立即付款
            </button>

            <!-- 已完成
            <text
              v-else-if="order.status === 'completed'"
              class="completed-text"
            >
              已完成
            </text> -->

            <!-- 已取消 -->
            <!-- <text
              v-else
              class="cancelled-text"
            >
              已取消
            </text> -->
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import { ordersStore } from "../../stores/orders";
import { authStore } from "../../stores/auth";


type TabValue =
  | "all"
  | "pending"
  | "completed"
  | "cancelled";

const currentTab = ref<TabValue>("all");

const tabs = [
  {
    label: "全部",
    value: "all" as TabValue,
  },
  {
    label: "待付款",
    value: "pending" as TabValue,
  },
  {
    label: "已完成",
    value: "completed" as TabValue,
  },
  {
    label: "已取消",
    value: "cancelled" as TabValue,
  },
];

const filteredOrders = computed(() => {
  if (currentTab.value === "all") {
    return ordersStore.orders;
  }

  return ordersStore.orders.filter(
    (order) => order.status === currentTab.value,
  );
});

const emptyText = computed(() => {
  switch (currentTab.value) {
    case "pending":
      return "暂无待付款订单";

    case "completed":
      return "暂无已完成订单";

    case "cancelled":
      return "暂无已取消订单";

    default:
      return "暂无订单";
  }
});

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

  ordersStore.reload();
});

const openOrder = (id: string) => {
  uni.navigateTo({
    url: `/pages/order-detail/order-detail?id=${id}`,
  });
};

const payOrder = (id: string) => {
  ordersStore.payOrder(id);

  uni.showToast({
    title: "支付成功",
    icon: "success",
  });
};

const goHome = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
</script>

<style scoped>
.page {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 24rpx;
  padding-bottom: 40rpx;
  background: #f5f6f2;
}

/* 页面标题 */

.header {
  padding: 16rpx 4rpx 24rpx;
}

.title {
  display: block;
  color: #303a33;
  font-size: 38rpx;
  font-weight: 700;
}

.count {
  display: block;
  margin-top: 8rpx;
  color: #8a918b;
  font-size: 24rpx;
}

/* 筛选 */

.tabs {
  display: flex;
  padding: 8rpx;
  margin-bottom: 20rpx;
  background: #fbfcf9;
  border-radius: 18rpx;
}

.tab {
  flex: 1;
  padding: 18rpx 0;
  color: #8a918b;
  font-size: 25rpx;
  text-align: center;
  border-radius: 14rpx;
}

.tab.active {
  color: #587160;
  font-weight: 600;
  background: #e8eee9;
}

/* 空状态 */

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 65vh;
}

.empty-icon {
  margin-bottom: 20rpx;
  font-size: 80rpx;
}

.empty-title {
  margin-bottom: 10rpx;
  color: #5f6861;
  font-size: 28rpx;
}

.empty-tip {
  margin-bottom: 28rpx;
  color: #9aa19b;
  font-size: 24rpx;
}

.go-home {
  width: 240rpx;
  color: #587160;
  font-size: 26rpx;
  background: #e8eee9;
  border-radius: 16rpx;
}

.go-home::after {
  border: none;
}

/* 订单 */

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.order-card {
  padding: 26rpx;
  background: #fbfcf9;
  border-radius: 24rpx;
  box-sizing: border-box;
}

/* 订单头部 */

.order-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #edf0eb;
}

.order-id {
  max-width: 65%;
  overflow: hidden;
  color: #8a918b;
  font-size: 22rpx;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.order-status {
  font-size: 24rpx;
  font-weight: 600;
}

.status-pending {
  color: #587160;
}

.status-completed {
  color: #6f7d72;
}

.status-cancelled {
  color: #9a9f9b;
}

/* 商品 */

.product-item {
  display: flex;
  padding: 20rpx 0;
}

.product-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 100rpx;
  height: 100rpx;
  margin-right: 20rpx;
  background: #f0f3ee;
  border-radius: 18rpx;
}

.product-icon text {
  font-size: 52rpx;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  display: block;
  margin-bottom: 10rpx;
  color: #303a33;
  font-size: 27rpx;
  font-weight: 600;
}

.sku-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-bottom: 10rpx;
}

.sku-tag {
  padding: 5rpx 10rpx;
  color: #758078;
  font-size: 20rpx;
  background: #f0f3ee;
  border-radius: 7rpx;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  color: #587160;
  font-size: 26rpx;
  font-weight: 600;
}

.quantity {
  color: #929993;
  font-size: 23rpx;
}

/* 底部 */

.order-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 20rpx;
  border-top: 1rpx solid #edf0eb;
}

.total-count {
  margin-right: 12rpx;
  color: #8a918b;
  font-size: 23rpx;
}

.total-label {
  margin-right: 8rpx;
  color: #6f7770;
  font-size: 24rpx;
}

.total-price {
  color: #303a33;
  font-size: 30rpx;
  font-weight: 700;
}

.order-actions {
  flex-shrink: 0;
  margin-left: 20rpx;
}

.pay-button {
  width: 150rpx;
  height: 62rpx;
  margin: 0;
  padding: 0;
  line-height: 62rpx;
  color: #ffffff;
  font-size: 24rpx;
  background: #587160;
  border-radius: 14rpx;
}

.pay-button::after {
  border: none;
}

.completed-text {
  color: #6f7d72;
  font-size: 24rpx;
}

.cancelled-text {
  color: #9a9f9b;
  font-size: 24rpx;
}
</style>