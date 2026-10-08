<template>
  <div class="orders-page">
    <Navbar />

    <main class="main">
      <!-- 页面标题 -->
      <section class="page-header">
        <div>
          <h1>我的订单</h1>
          <p>查看和管理你的订单</p>
        </div>

        <div class="order-count">
          共 {{ filteredOrders.length }} 个订单
        </div>
      </section>

      <!-- 状态 Tab -->
      <section class="status-tabs">
        <button v-for="tab in tabs" :key="tab.value" class="status-tab" :class="{
          active: activeTab === tab.value
        }" @click="activeTab = tab.value">
          {{ tab.label }}

          <span class="tab-count">
            {{ getTabCount(tab.value) }}
          </span>
        </button>
      </section>

      <!-- 没有订单 -->
      <section v-if="filteredOrders.length === 0" class="empty-orders">
        <div class="empty-icon">
          📦
        </div>

        <h2>
          {{ getEmptyText() }}
        </h2>

        <p>
          {{ getEmptyDescription() }}
        </p>

        <button v-if="activeTab === '全部'" class="go-category-btn" @click="goCategory">
          去逛逛
        </button>
      </section>

      <!-- 订单列表 -->
      <section v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.id" class="order-card" @click="goOrderDetail(order.id)">
          <!-- 订单头部 -->
          <div class="order-header">
            <div>
              <span class="order-label">
                订单编号
              </span>

              <span class="order-id">
                #{{ order.id }}
              </span>
            </div>

            <span class="order-status" :class="getStatusClass(order.status)">
              {{ order.status }}
            </span>
          </div>

          <!-- 下单时间 -->
          <div class="order-time">
            下单时间：{{ order.createTime }}
          </div>

          <!-- 商品 -->
          <div class="order-items">
            <div v-for="item in order.items" :key="`${order.id}-${item.id}-${item.skuId}`" class="order-item">
              <div class="item-icon">
                {{ item.icon }}
              </div>

              <div class="item-info">
                <h3>
                  {{ item.name }}
                </h3>

                <div class="item-meta">
                  <span>
                    ¥{{ item.price }}
                  </span>

                  <span>
                    × {{ item.quantity }}
                  </span>
                </div>

                <div v-if="item.skuOptions" class="item-sku">
                  {{
                    Object.entries(item.skuOptions)
                      .map(
                        ([key, value]) =>
                          `${key}：${value}`
                  )
                  .join(" / ")
                  }}
                </div>
              </div>

              <div class="item-subtotal">
                ¥{{
                  (
                    item.price * item.quantity
                  ).toFixed(2)
                }}
              </div>
            </div>
          </div>

          <!-- 订单底部 -->
          <div class="order-footer">
            <div class="order-total">
              <span>订单总额</span>

              <strong>
                ¥{{ Number(order.total).toFixed(2) }}
              </strong>
            </div>

            <!-- 待付款操作 -->
            <div v-if="order.status === '待付款'" class="order-actions">
              <button class="cancel-btn" @click.stop="handleCancel(order.id)">
                取消订单
              </button>

              <button class="pay-btn" @click.stop="handlePay(order.id)">
                立即付款
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/Navbar.vue";
import {
  useOrdersStore,
  type OrderStatus
} from "../stores/orders";

const router = useRouter();

const goOrderDetail = (id: number) => {
  router.push(`/order/${id}`);
};

const ordersStore = useOrdersStore();

type TabType =
  | "全部"
  | "待付款"
  | "已完成"
  | "已取消";

const activeTab = ref<TabType>("全部");

const tabs: {
  label: string;
  value: TabType;
}[] = [
    {
      label: "全部",
      value: "全部"
    },
    {
      label: "待付款",
      value: "待付款"
    },
    {
      label: "已完成",
      value: "已完成"
    },
    {
      label: "已取消",
      value: "已取消"
    }
  ];

/**
 * 当前 Tab 对应的订单
 */
const filteredOrders = computed(() => {
  if (activeTab.value === "全部") {
    return ordersStore.orders;
  }

  return ordersStore.orders.filter(
    (order) =>
      order.status === activeTab.value
  );
});

/**
 * 各状态订单数量
 */
const getTabCount = (
  tab: TabType
) => {
  if (tab === "全部") {
    return ordersStore.orders.length;
  }

  return ordersStore.orders.filter(
    (order) =>
      order.status === tab
  ).length;
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
const handlePay = (id: number) => {
  const confirmed = window.confirm(
    "确认立即付款吗？"
  );

  if (!confirmed) {
    return;
  }

  ordersStore.payOrder(id);
};

/**
 * 取消订单
 */
const handleCancel = (id: number) => {
  const confirmed = window.confirm(
    "确定要取消这个订单吗？"
  );

  if (!confirmed) {
    return;
  }

  ordersStore.cancelOrder(id);
};

/**
 * 空状态标题
 */
const getEmptyText = () => {
  switch (activeTab.value) {
    case "待付款":
      return "暂无待付款订单";

    case "已完成":
      return "暂无已完成订单";

    case "已取消":
      return "暂无已取消订单";

    default:
      return "还没有订单";
  }
};

/**
 * 空状态描述
 */
const getEmptyDescription = () => {
  switch (activeTab.value) {
    case "待付款":
      return "当前没有等待付款的订单";

    case "已完成":
      return "完成订单后会显示在这里";

    case "已取消":
      return "取消的订单会显示在这里";

    default:
      return "去发现一些喜欢的商品吧";
  }
};

/**
 * 去分类页
 */
const goCategory = () => {
  router.push("/category");
};
</script>

<style scoped>
.orders-page {
  min-height: 100vh;

  background: #f2f1ec;
}

.main {
  max-width: 1100px;

  margin: 0 auto;

  padding: 40px;
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

.order-count {
  font-size: 13px;

  color: #888b84;
}

/* 状态 Tab */
.status-tabs {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 28px;

  padding: 6px;

  width: fit-content;

  background: #e9e8e1;

  border-radius: 12px;
}

.status-tab {
  min-width: 92px;

  padding: 9px 16px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 6px;

  border: none;

  border-radius: 8px;

  background: transparent;

  color: #777a73;

  font-size: 13px;

  cursor: pointer;

  transition:
    background 0.2s,
    color 0.2s,
    box-shadow 0.2s;
}

.status-tab:hover {
  color: #587160;
}

.status-tab.active {
  background: #f8f7f2;

  color: #587160;

  font-weight: 600;

  box-shadow:
    0 2px 8px rgba(80, 90, 80, 0.08);
}

.tab-count {
  min-width: 18px;

  height: 18px;

  padding: 0 5px;

  display: inline-flex;

  align-items: center;

  justify-content: center;

  border-radius: 10px;

  background: #e4e3dc;

  color: #888b84;

  font-size: 11px;
}

.status-tab.active .tab-count {
  background: #dce7df;

  color: #587160;
}

/* 订单列表 */
.orders-list {
  display: flex;

  flex-direction: column;

  gap: 18px;
}

/* 订单卡片 */
.order-card {
  padding: 22px 24px;

  background: #f8f7f2;

  border: 1px solid #e4e2db;

  border-radius: 16px;

  transition:
    box-shadow 0.2s,
    transform 0.2s;
}

.order-card:hover {
  transform: translateY(-2px);

  box-shadow:
    0 8px 24px rgba(80, 90, 80, 0.07);
}

/* 订单头部 */
.order-header {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding-bottom: 12px;

  border-bottom: 1px solid #ebe9e2;
}

.order-label {
  margin-right: 8px;

  font-size: 13px;

  color: #92948e;
}

.order-id {
  font-size: 13px;

  color: #555a54;
}

/* 状态 */
.order-status {
  display: inline-flex;

  align-items: center;

  padding: 5px 11px;

  border-radius: 14px;

  font-size: 12px;

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

/* 时间 */
.order-time {
  padding: 14px 0;

  font-size: 12px;

  color: #999b95;
}

/* 商品 */
.order-items {
  display: flex;

  flex-direction: column;

  gap: 12px;
}

.order-item {
  display: flex;

  align-items: center;

  gap: 14px;

  padding: 12px;

  background: #f2f1ec;

  border-radius: 10px;
}

.item-icon {
  width: 48px;
  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: #e8e7e0;

  font-size: 24px;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin-bottom: 7px;

  font-size: 15px;

  color: #30312f;
}

.item-meta {
  display: flex;

  gap: 16px;

  font-size: 12px;

  color: #888b84;
}

.item-subtotal {
  font-size: 14px;

  font-weight: 600;

  color: #587160;
}

/* 底部 */
.order-footer {
  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-top: 18px;

  padding-top: 18px;

  border-top: 1px solid #ebe9e2;
}

.order-total {
  display: flex;

  align-items: center;

  gap: 12px;
}

.order-total span {
  font-size: 13px;

  color: #777a73;
}

.order-total strong {
  font-size: 20px;

  color: #587160;
}

/* 操作按钮 */
.order-actions {
  display: flex;

  align-items: center;

  gap: 10px;
}

.cancel-btn,
.pay-btn {
  padding: 8px 17px;

  border-radius: 8px;

  font-size: 13px;

  cursor: pointer;

  transition:
    background 0.2s,
    border-color 0.2s,
    color 0.2s;
}

/* 取消 */
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

/* 付款 */
.pay-btn {
  border: 1px solid #587160;

  background: #587160;

  color: #ffffff;
}

.pay-btn:hover {
  background: #486052;

  border-color: #486052;
}

/* 空订单 */
.empty-orders {
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

.empty-orders h2 {
  margin-bottom: 8px;

  font-size: 20px;

  color: #30312f;
}

.empty-orders p {
  margin-bottom: 24px;

  font-size: 14px;

  color: #888b84;
}

.go-category-btn {
  padding: 10px 22px;

  border: none;

  border-radius: 8px;

  background: #587160;

  color: #ffffff;

  font-size: 14px;

  cursor: pointer;
}

.go-category-btn:hover {
  background: #486052;
}

/* 响应式 */
@media (max-width: 700px) {
  .main {
    padding: 30px 20px;
  }

  .page-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 10px;
  }

  .status-tabs {
    width: 100%;

    overflow-x: auto;
  }

  .status-tab {
    flex: 1;

    min-width: 80px;
  }

  .order-card {
    padding: 18px;
  }

  .order-footer {
    align-items: flex-end;

    flex-direction: column;

    gap: 14px;
  }

  .order-actions {
    width: 100%;

    justify-content: flex-end;
  }
}
.item-sku {
  margin-top: 6px;

  color: #999b95;

  font-size: 12px;
}
</style>