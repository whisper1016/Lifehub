<!-- 订单详情页 -->

<template>
    <div class="order-detail-page">
        <Navbar />

        <main class="main">
            <!-- 返回 -->
            <button class="back-btn" @click="goBack">
                ← 返回订单
            </button>

            <!-- 找不到订单 -->
            <section v-if="!order" class="empty-order">
                <div class="empty-icon">
                    📦
                </div>

                <h2>订单不存在</h2>

                <p>
                    该订单可能已经被删除
                </p>

                <button class="back-orders-btn" @click="goOrders">
                    返回订单列表
                </button>
            </section>

            <!-- 订单详情 -->
            <template v-else>
                <!-- 页面标题 -->
                <section class="page-header">
                    <div>
                        <h1>订单详情</h1>

                        <p>
                            查看订单信息
                        </p>
                    </div>

                    <span class="order-status" :class="getStatusClass(order.status)">
                        {{ order.status }}
                    </span>
                </section>

                <!-- 订单基本信息 -->
                <section class="info-card">
                    <div class="info-item">
                        <span class="info-label">
                            订单编号
                        </span>

                        <span class="info-value">
                            #{{ order.id }}
                        </span>
                    </div>

                    <div class="info-item">
                        <span class="info-label">
                            下单时间
                        </span>

                        <span class="info-value">
                            {{ order.createTime }}
                        </span>
                    </div>
                </section>

                <!-- 商品信息 -->
                <section class="detail-card">
                    <div class="section-title">
                        商品信息
                    </div>

                    <div class="product-list">
                        <div v-for="item in order.items" :key="`${order.id}-${item.id}-${item.skuId}`"
                            class="product-item">
                            <div class="product-icon">
                                {{ item.icon }}
                            </div>

                            <div class="product-info">
                                <h3>
                                    {{ item.name }}
                                </h3>
                                <div v-if="Object.keys(item.skuOptions).length > 0" class="product-sku">
                                    {{
                                        Object.entries(item.skuOptions)
                                            .map(
                                                ([key, value]) =>
                                                    `${key}：${value}`
                                            )
                                            .join(" / ")
                                    }}
                                </div>

                                <div class="product-meta">
                                    <span>
                                        单价：¥{{ item.price }}
                                    </span>

                                    <span>
                                        数量：{{ item.quantity }}
                                    </span>
                                </div>
                            </div>

                            <div class="product-subtotal">
                                ¥{{
                                    (
                                        item.price * item.quantity
                                    ).toFixed(2)
                                }}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 订单金额 -->
                <section class="detail-card">
                    <div class="section-title">
                        订单金额
                    </div>

                    <div class="price-list">
                        <div class="price-row">
                            <span>
                                商品数量
                            </span>

                            <span>
                                {{ totalQuantity }} 件
                            </span>
                        </div>

                        <div class="price-row">
                            <span>
                                商品总价
                            </span>

                            <span>
                                ¥{{ order.total.toFixed(2) }}
                            </span>
                        </div>

                        <div class="price-divider"></div>

                        <div class="total-row">
                            <span>
                                订单总额
                            </span>

                            <strong>
                                ¥{{ order.total.toFixed(2) }}
                            </strong>
                        </div>
                    </div>
                </section>

                <!-- 操作 -->
                <section v-if="order.status === '待付款'" class="actions-card">
                    <button class="cancel-btn" @click="handleCancel">
                        取消订单
                    </button>

                    <button class="pay-btn" @click="handlePay">
                        立即付款
                    </button>
                </section>
            </template>
        </main>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import Navbar from "../components/Navbar.vue";
import {
    useOrdersStore,
    type OrderStatus
} from "../stores/orders";

const route = useRoute();
const router = useRouter();

const ordersStore = useOrdersStore();

/**
 * 当前订单
 */
const orderId = Number(route.params.id);

const order = computed(() => {
    return ordersStore.orders.find(
        (item) => item.id === orderId
    );
});

/**
 * 商品总数量
 */
const totalQuantity = computed(() => {
    if (!order.value) {
        return 0;
    }

    return order.value.items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );
});

/**
 * 返回
 */
const goBack = () => {
    router.push("/orders");
};

const goOrders = () => {
    router.push("/orders");
};

/**
 * 状态样式
 */
const getStatusClass = (
    status: OrderStatus
) => {
    switch (status) {
        case "待付款":
            return "status-pending";

        case "已完成":
            return "status-completed";

        case "已取消":
            return "status-cancelled";

        default:
            return "";
    }
};

/**
 * 立即付款
 */
const handlePay = () => {
    if (!order.value) {
        return;
    }

    const confirmed = window.confirm(
        "确认立即付款吗？"
    );

    if (!confirmed) {
        return;
    }

    ordersStore.payOrder(order.value.id);
};

/**
 * 取消订单
 */
const handleCancel = () => {
    if (!order.value) {
        return;
    }

    const confirmed = window.confirm(
        "确定要取消这个订单吗？"
    );

    if (!confirmed) {
        return;
    }

    ordersStore.cancelOrder(order.value.id);
};
</script>

<style scoped>
.order-detail-page {
    min-height: 100vh;
    background: #f2f1ec;
}

.main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 36px 40px 60px;
}

/* 返回 */
.back-btn {
    margin-bottom: 24px;

    padding: 8px 0;

    border: none;

    background: transparent;

    color: #687169;

    font-size: 14px;

    cursor: pointer;

    transition: color 0.2s;
}

.back-btn:hover {
    color: #587160;
}

/* 页面标题 */
.page-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    margin-bottom: 26px;
}

.page-header h1 {
    margin-bottom: 8px;

    font-size: 30px;
    color: #30312f;
}

.page-header p {
    font-size: 14px;
    color: #777a73;
}

/* 状态 */
.order-status {
    display: inline-flex;
    align-items: center;

    padding: 7px 14px;

    border-radius: 16px;

    font-size: 13px;
    font-weight: 600;
}

.status-pending {
    background: #f5e9d3;
    color: #9b7438;
}

.status-completed {
    background: #e1eee5;
    color: #52765c;
}

.status-cancelled {
    background: #ece9e5;
    color: #92908a;
}

/* 基础信息 */
.info-card {
    display: flex;

    flex-direction: column;

    gap: 18px;

    margin-bottom: 18px;

    padding: 22px 24px;

    background: #f8f7f2;

    border: 1px solid #e4e2db;
    border-radius: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 20px;
}

.info-label {
    font-size: 13px;
    color: #92948e;
}

.info-value {
    font-size: 13px;
    color: #555a54;
}

/* 卡片 */
.detail-card {
    margin-bottom: 18px;

    padding: 24px;

    background: #f8f7f2;

    border: 1px solid #e4e2db;
    border-radius: 16px;
}

.section-title {
    margin-bottom: 20px;

    font-size: 17px;
    font-weight: 600;

    color: #30312f;
}

/* 商品 */
.product-list {
    display: flex;
    flex-direction: column;

    gap: 14px;
}

.product-item {
    display: flex;
    align-items: center;

    gap: 16px;

    padding: 14px;

    background: #f2f1ec;

    border-radius: 12px;
}

.product-icon {
    width: 58px;
    height: 58px;

    display: flex;
    align-items: center;
    justify-content: center;

    flex-shrink: 0;

    border-radius: 12px;

    background: #e8e7e0;

    font-size: 28px;
}

.product-info {
    flex: 1;
}

.product-info h3 {
    margin-bottom: 8px;

    font-size: 15px;
    color: #30312f;
}

.product-meta {
    display: flex;
    gap: 18px;

    font-size: 12px;
    color: #888b84;
}

.product-subtotal {
    font-size: 15px;
    font-weight: 600;
    color: #587160;
}

/* 金额 */
.price-list {
    display: flex;
    flex-direction: column;

    gap: 14px;
}

.price-row {
    display: flex;
    justify-content: space-between;

    font-size: 13px;
    color: #777a73;
}

.price-divider {
    height: 1px;

    margin: 4px 0;

    background: #ebe9e2;
}

.total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.total-row span {
    font-size: 14px;
    color: #555a54;
}

.total-row strong {
    font-size: 24px;
    color: #587160;
}

/* 操作 */
.actions-card {
    display: flex;
    justify-content: flex-end;

    gap: 10px;

    padding: 20px 24px;

    background: #f8f7f2;

    border: 1px solid #e4e2db;
    border-radius: 16px;
}

.cancel-btn,
.pay-btn {
    padding: 10px 20px;

    border-radius: 8px;

    font-size: 13px;

    cursor: pointer;

    transition:
        background 0.2s,
        border-color 0.2s,
        color 0.2s;
}

.cancel-btn {
    border: 1px solid #d9d7d0;

    background: #f8f7f2;

    color: #77746e;
}

.cancel-btn:hover {
    border-color: #c9a9a2;

    background: #f5ebe8;

    color: #a25f54;
}

.pay-btn {
    border: 1px solid #587160;

    background: #587160;

    color: #ffffff;
}

.pay-btn:hover {
    border-color: #486052;

    background: #486052;
}

/* 空订单 */
.empty-order {
    padding: 90px 20px;

    text-align: center;

    background: #f8f7f2;

    border: 1px solid #e4e2db;
    border-radius: 16px;
}

.empty-icon {
    margin-bottom: 18px;

    font-size: 48px;
}

.empty-order h2 {
    margin-bottom: 8px;

    font-size: 20px;
    color: #30312f;
}

.empty-order p {
    margin-bottom: 24px;

    font-size: 14px;
    color: #888b84;
}

.back-orders-btn {
    padding: 10px 20px;

    border: none;
    border-radius: 8px;

    background: #587160;
    color: #ffffff;

    font-size: 14px;

    cursor: pointer;
}

.back-orders-btn:hover {
    background: #486052;
}

/* 响应式 */
@media (max-width: 700px) {
    .main {
        padding: 30px 20px 50px;
    }

    .page-header {
        align-items: flex-start;

        flex-direction: column;

        gap: 14px;
    }

    .info-card,
    .detail-card,
    .actions-card {
        padding: 18px;
    }

    .product-subtotal {
        font-size: 13px;
    }

    .actions-card {
        justify-content: stretch;
    }

    .cancel-btn,
    .pay-btn {
        flex: 1;
    }
}

.product-sku {
    margin-bottom: 8px;

    color: #999b95;

    font-size: 12px;
}
</style>
