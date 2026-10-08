<template>
    <view class="page">
        <!-- 找不到订单 -->
        <view v-if="!order" class="empty">
            <text class="empty-icon">📦</text>
            <text class="empty-title">订单不存在</text>
            <button class="back-button" @click="goBack">
                返回订单
            </button>
        </view>

        <!-- 订单详情 -->
        <view v-else class="content">
            <!-- 状态 -->
            <view class="status-card">
                <view>
                    <text class="status-label">订单状态</text>
                    <text class="status-text">
                        {{ order.statusText }}
                    </text>
                </view>

                <text class="status-icon">
                    {{
                        order.status === "pending"
                            ? "⏳"
                            : order.status === "completed"
                    ? "✓"
                    : "×"
                    }}
                </text>
            </view>

            <!-- 商品 -->
            <view class="section">
                <view class="section-title">
                    商品信息
                </view>

                <view v-for="item in order.items" :key="`${item.id}-${item.skuId || 'default'}`" class="product-item">
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

                        <view class="price-row">
                            <text class="price">
                                ¥{{ item.price }}
                            </text>

                            <text class="quantity">
                                × {{ item.quantity }}
                            </text>
                        </view>
                    </view>
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="section">
                <view class="section-title">
                    订单信息
                </view>

                <view class="info-row">
                    <text class="info-label">订单编号</text>
                    <text class="info-value">
                        {{ order.id }}
                    </text>
                </view>

                <view class="info-row">
                    <text class="info-label">下单时间</text>
                    <text class="info-value">
                        {{ order.createTime }}
                    </text>
                </view>

                <view class="info-row">
                    <text class="info-label">商品数量</text>
                    <text class="info-value">
                        {{ order.totalCount }} 件
                    </text>
                </view>
            </view>

            <!-- 金额 -->
            <view class="price-card">
                <text class="price-label">订单合计</text>

                <text class="total-price">
                    ¥{{ order.totalPrice }}
                </text>
            </view>

            <!-- 待付款 -->
            <view v-if="order.status === 'pending'" class="action-area">
                <button class="cancel-button" @click="cancelOrder">
                    取消订单
                </button>

                <button class="pay-button" @click="payOrder">
                    立即付款
                </button>
            </view>

            <!-- 已完成 -->
            <view v-else-if="order.status === 'completed'" class="completed-tip">
                <text class="completed-icon">✓</text>
                <text>订单已完成</text>
            </view>

            <!-- 已取消 -->
            <view v-else class="cancelled-tip">
                <text class="cancelled-icon">×</text>
                <text>订单已取消</text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
    onLoad,
    onShow,
} from "@dcloudio/uni-app";
import { ordersStore } from "../../stores/orders";
import { authStore } from "../../stores/auth";

const orderId = ref("");

onLoad((options) => {
    orderId.value = String(options?.id || "");
});

/**
 * 页面显示时检查登录状态
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

        return;
    }

    // 确保当前账号订单数据是最新的
    ordersStore.reload();
});

const order = computed(() => {
    return ordersStore.orders.find(
        (item) => item.id === orderId.value,
    );
});

/**
 * 支付订单
 */
const payOrder = () => {
    if (!order.value) return;

    ordersStore.payOrder(order.value.id);

    uni.showToast({
        title: "支付成功",
        icon: "success",
    });
};

/**
 * 取消订单
 */
const cancelOrder = () => {
    if (!order.value) return;

    uni.showModal({
        title: "取消订单",
        content: "确定要取消这个订单吗？",
        success: (res) => {
            if (!res.confirm) return;

            ordersStore.cancelOrder(
                order.value!.id,
            );

            uni.showToast({
                title: "订单已取消",
                icon: "success",
            });
        },
    });
};

/**
 * 返回订单列表
 */
const goBack = () => {
    uni.navigateBack();
};
</script>

<style scoped>
.page {
    min-height: 100vh;
    box-sizing: border-box;
    padding: 24rpx;
    padding-bottom: 60rpx;
    background: #f5f6f2;
}

.content {
    width: 100%;
}

/* 状态 */

.status-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: #fbfcf9;
    border-radius: 24rpx;
    box-sizing: border-box;
}

.status-label {
    display: block;
    margin-bottom: 10rpx;
    color: #8a918b;
    font-size: 24rpx;
}

.status-text {
    display: block;
    color: #587160;
    font-size: 34rpx;
    font-weight: 600;
}

.status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 76rpx;
    height: 76rpx;
    color: #587160;
    font-size: 38rpx;
    background: #e8eee9;
    border-radius: 50%;
}

/* 区块 */

.section {
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: #fbfcf9;
    border-radius: 24rpx;
    box-sizing: border-box;
}

.section-title {
    margin-bottom: 24rpx;
    color: #303a33;
    font-size: 30rpx;
    font-weight: 600;
}

/* 商品 */

.product-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #edf0eb;
}

.product-item:last-child {
    border-bottom: none;
}

.product-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 120rpx;
    height: 120rpx;
    margin-right: 20rpx;
    background: #f0f3ee;
    border-radius: 20rpx;
}

.product-icon text {
    font-size: 60rpx;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    display: block;
    margin-bottom: 12rpx;
    color: #303a33;
    font-size: 28rpx;
    font-weight: 600;
}

.sku-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
    margin-bottom: 14rpx;
}

.sku-tag {
    padding: 6rpx 12rpx;
    color: #6f7d72;
    font-size: 22rpx;
    background: #f0f3ee;
    border-radius: 8rpx;
}

.price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.price {
    color: #587160;
    font-size: 28rpx;
    font-weight: 600;
}

.quantity {
    color: #8a918b;
    font-size: 24rpx;
}

/* 订单信息 */

.info-row {
    display: flex;
    justify-content: space-between;
    padding: 18rpx 0;
}

.info-label {
    color: #8a918b;
    font-size: 25rpx;
}

.info-value {
    max-width: 65%;
    color: #303a33;
    font-size: 25rpx;
    text-align: right;
    word-break: break-all;
}

/* 金额 */

.price-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    margin-bottom: 20rpx;
    background: #fbfcf9;
    border-radius: 24rpx;
}

.price-label {
    color: #303a33;
    font-size: 28rpx;
    font-weight: 600;
}

.total-price {
    color: #587160;
    font-size: 38rpx;
    font-weight: 700;
}

/* 操作 */

.action-area {
    padding: 10rpx 0;
}

.pay-button {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    color: #ffffff;
    font-size: 30rpx;
    background: #587160;
    border-radius: 18rpx;
}

.pay-button::after {
    border: none;
}

/* 已完成 */

.completed-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    padding: 30rpx;
    color: #587160;
    font-size: 26rpx;
}

/* 空状态 */

.empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 70vh;
}

.empty-icon {
    margin-bottom: 20rpx;
    font-size: 80rpx;
}

.empty-title {
    margin-bottom: 30rpx;
    color: #6f7770;
    font-size: 28rpx;
}

.back-button {
    width: 260rpx;
    color: #587160;
    background: #e8eee9;
    border-radius: 16rpx;
}

.back-button::after {
    border: none;
}

/* 取消订单 */
.cancel-button {
    width: 100%;
    height: 82rpx;
    margin-bottom: 16rpx;
    line-height: 82rpx;
    color: #6f7770;
    font-size: 28rpx;
    background: #eef0ec;
    border-radius: 18rpx;
}

.cancel-button::after {
    border: none;
}

.cancelled-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    padding: 30rpx;
    color: #8a918b;
    font-size: 26rpx;
}

.cancelled-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 42rpx;
    height: 42rpx;
    color: #8a918b;
    font-size: 28rpx;
    background: #e8ebe7;
    border-radius: 50%;
}
</style>