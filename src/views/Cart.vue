<template>
  <div class="cart-page">
    <Navbar />

    <main class="main">
      <!-- 页面标题 -->
      <div class="page-header">
        <div>
          <h1>购物车</h1>

          <p>
            共 {{ cart.totalCount }} 件商品
          </p>
        </div>
      </div>

      <!-- 空购物车 -->
      <div v-if="cart.items.length === 0" class="empty-cart">
        <div class="empty-icon">
          🛒
        </div>

        <h2>购物车还是空的</h2>

        <p>
          去挑选一些喜欢的商品吧
        </p>

        <button @click="goCategory">
          去逛逛
        </button>
      </div>

      <!-- 购物车 -->
      <div v-else class="cart-layout">
        <!-- 商品列表 -->
        <section class="cart-list">
          <!-- 全选 -->
          <div class="select-all-row">
            <label class="checkbox-wrap">
              <input type="checkbox" :checked="allSelected" @change="toggleAll" />

              <span class="checkbox-text">
                全选
              </span>
            </label>

            <span class="selected-info">
              已选择
              {{ selectedItems.length }}
              种商品
            </span>
          </div>

          <!-- 商品 -->
          <div v-for="item in cart.items" :key="`${item.id}-${item.skuId}`" class="cart-item">
            <!-- 选择 -->
            <label class="checkbox-wrap item-checkbox">
              <input type="checkbox" :checked="isSelected(item)
                " @change="
                  toggleItem(item)
                  " />
            </label>

            <!-- 图标 -->
            <div class="item-icon">
              {{ item.icon }}
            </div>

            <!-- 商品信息 -->
            <div class="item-info">
              <h3>
                {{ item.name }}
              </h3>

              <p class="sku-text">
                {{ formatSku(item.skuOptions) }}
              </p>

              <div class="item-price">
                ¥{{ item.price.toFixed(2) }}
              </div>
            </div>

            <!-- 数量 -->
            <div class="quantity-control">
              <button @click="
                cart.decrease(
                  item.id,
                  item.skuId
                )
                ">
                −
              </button>

              <span>
                {{ item.quantity }}
              </span>

              <button @click="
                cart.increase(
                  item.id,
                  item.skuId
                )
                ">
                +
              </button>
            </div>

            <!-- 小计 -->
            <div class="item-total">
              ¥{{
                (
                  item.price *
                  item.quantity
                ).toFixed(2)
              }}
            </div>

            <!-- 删除 -->
            <button class="remove-btn" @click="
              removeItem(item)
              ">
              删除
            </button>
          </div>
        </section>

        <!-- 订单摘要 -->
        <aside class="summary">
          <h2>订单摘要</h2>

          <div class="summary-row">
            <span>
              已选商品
            </span>

            <span>
              {{ selectedQuantity }} 件
            </span>
          </div>

          <div class="summary-row">
            <span>
              商品总价
            </span>

            <span>
              ¥{{ selectedTotalPrice.toFixed(2) }}
            </span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-total">
            <span>
              合计
            </span>

            <strong>
              ¥{{ selectedTotalPrice.toFixed(2) }}
            </strong>
          </div>

          <button class="checkout-btn" :disabled="selectedItems.length === 0
            " @click="checkout">
            {{
              selectedItems.length === 0
                ? "请选择商品"
                : "去结算"
            }}
          </button>
        </aside>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref
} from "vue";

import { useRouter } from "vue-router";

import Navbar from "../components/Navbar.vue";

import {
  useCartStore,
  type CartItem
} from "../stores/cart";

import { useOrdersStore } from "../stores/orders";

const router = useRouter();

const cart = useCartStore();
const ordersStore = useOrdersStore();

/**
 * 已选商品
 */
const selectedKeys =
  ref<string[]>([]);

/**
 * SKU 唯一 Key
 */
const getItemKey = (
  item: CartItem
) => {
  return `${item.id}-${item.skuId}`;
};

/**
 * 是否已选
 */
const isSelected = (
  item: CartItem
) => {
  return selectedKeys.value.includes(
    getItemKey(item)
  );
};

/**
 * 当前选中的商品
 */
const selectedItems = computed(() => {
  return cart.items.filter((item) =>
    selectedKeys.value.includes(
      getItemKey(item)
    )
  );
});

/**
 * 已选商品总数量
 */
const selectedQuantity = computed(() => {
  return selectedItems.value.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );
});

/**
 * 已选商品总价
 */
const selectedTotalPrice =
  computed(() => {
    return selectedItems.value.reduce(
      (total, item) =>
        total +
        item.price *
        item.quantity,
      0
    );
  });

/**
 * 是否全选
 */
const allSelected = computed(() => {
  return (
    cart.items.length > 0 &&
    selectedItems.value.length ===
    cart.items.length
  );
});

/**
 * 切换商品选择
 */
const toggleItem = (
  item: CartItem
) => {
  const key = getItemKey(item);

  const index =
    selectedKeys.value.indexOf(key);

  if (index !== -1) {
    selectedKeys.value.splice(
      index,
      1
    );
  } else {
    selectedKeys.value.push(key);
  }
};

/**
 * 全选 / 取消全选
 */
const toggleAll = () => {
  if (allSelected.value) {
    selectedKeys.value = [];
    return;
  }

  selectedKeys.value =
    cart.items.map((item) =>
      getItemKey(item)
    );
};

/**
 * 删除商品
 */
const removeItem = (
  item: CartItem
) => {
  const key = getItemKey(item);

  selectedKeys.value =
    selectedKeys.value.filter(
      (itemKey) =>
        itemKey !== key
    );

  cart.removeItem(
    item.id,
    item.skuId
  );
};

/**
 * SKU 显示
 */
const formatSku = (
  options: Record<string, string>
) => {
  return Object.entries(options)
    .map(
      ([key, value]) =>
        `${key}：${value}`
    )
    .join(" / ");
};

/**
 * 去结算
 */
const checkout = () => {
  if (
    selectedItems.value.length ===
    0
  ) {
    return;
  }

  const order = {
    id: Date.now(),

    items: selectedItems.value.map(
      (item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        icon: item.icon,
        quantity: item.quantity,
        skuId: item.skuId,
        skuOptions:
          item.skuOptions
      })
    ),

    total: selectedTotalPrice.value,

    createTime:
      new Date().toLocaleString()
  };

  // 创建订单
  ordersStore.addOrder(order);

  // 只删除已经结算的商品
  const selectedItemsSnapshot = [
    ...selectedItems.value
  ];

  selectedItemsSnapshot.forEach((item) => {
    cart.removeItem(
      item.id,
      item.skuId
    );
  });

  // 清空选择
  selectedKeys.value = [];

  // 跳转订单
  router.push("/orders");
};

/**
 * 去分类页
 */
const goCategory = () => {
  router.push("/category");
};
</script>

<style scoped>
.cart-page {
  min-height: 100vh;

  background: #f2f1ec;
}

.main {
  max-width: 1100px;

  margin: 0 auto;

  padding: 40px;
}

.page-header {
  margin-bottom: 28px;
}

.page-header h1 {
  margin-bottom: 8px;

  color: #30312f;

  font-size: 30px;
}

.page-header p {
  color: #777a73;

  font-size: 14px;
}

/* 布局 */
.cart-layout {
  display: grid;

  grid-template-columns:
    1fr 320px;

  gap: 20px;

  align-items: start;
}

/* 商品列表 */
.cart-list {
  padding: 20px;

  background: #f8f7f2;

  border: 1px solid #e4e2db;

  border-radius: 16px;
}

/* 全选 */
.select-all-row {
  display: flex;

  align-items: center;

  justify-content: space-between;

  padding-bottom: 16px;

  margin-bottom: 14px;

  border-bottom: 1px solid #ebe9e2;
}

.checkbox-wrap {
  display: flex;

  align-items: center;

  gap: 9px;

  cursor: pointer;
}

.checkbox-wrap input {
  width: 16px;
  height: 16px;

  accent-color: #587160;

  cursor: pointer;
}

.checkbox-text {
  color: #555a54;

  font-size: 14px;
}

.selected-info {
  color: #999b95;

  font-size: 12px;
}

/* 商品 */
.cart-list {
  display: flex;

  flex-direction: column;

  gap: 14px;
}

.cart-item {
  display: grid;

  grid-template-columns:
    24px 58px 1fr auto 100px auto;

  align-items: center;

  gap: 14px;

  padding: 14px;

  background: #f2f1ec;

  border-radius: 12px;
}

.item-checkbox {
  width: 20px;
}

.item-icon {
  width: 58px;
  height: 58px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 12px;

  background: #e8e7e0;

  font-size: 28px;
}

.item-info {
  min-width: 0;
}

.item-info h3 {
  margin-bottom: 6px;

  color: #30312f;

  font-size: 15px;
}

.sku-text {
  margin-bottom: 7px;

  color: #888b84;

  font-size: 12px;

  white-space: nowrap;

  overflow: hidden;

  text-overflow: ellipsis;
}

.item-price {
  color: #587160;

  font-size: 14px;

  font-weight: 600;
}

/* 数量 */
.quantity-control {
  display: flex;

  align-items: center;

  border: 1px solid #dddcd5;

  border-radius: 7px;

  overflow: hidden;
}

.quantity-control button {
  width: 30px;
  height: 30px;

  border: none;

  background: #eeece6;

  color: #555a54;

  cursor: pointer;
}

.quantity-control span {
  width: 34px;

  text-align: center;

  color: #30312f;

  font-size: 13px;
}

.item-total {
  color: #587160;

  font-size: 14px;

  font-weight: 600;

  text-align: right;
}

/* 删除 */
.remove-btn {
  border: none;

  background: transparent;

  color: #999b95;

  font-size: 13px;

  cursor: pointer;
}

.remove-btn:hover {
  color: #a25f54;
}

/* 摘要 */
.summary {
  position: sticky;

  top: 100px;

  padding: 22px;

  background: #f8f7f2;

  border: 1px solid #e4e2db;

  border-radius: 16px;
}

.summary h2 {
  margin-bottom: 22px;

  color: #30312f;

  font-size: 18px;
}

.summary-row {
  display: flex;

  justify-content: space-between;

  margin-bottom: 16px;

  color: #777a73;

  font-size: 13px;
}

.summary-divider {
  height: 1px;

  margin: 18px 0;

  background: #ebe9e2;
}

.summary-total {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

.summary-total span {
  color: #555a54;

  font-size: 14px;
}

.summary-total strong {
  color: #587160;

  font-size: 24px;
}

/* 结算 */
.checkout-btn {
  width: 100%;

  height: 44px;

  margin-top: 24px;

  border: none;

  border-radius: 9px;

  background: #587160;

  color: #ffffff;

  font-size: 14px;

  cursor: pointer;

  transition:
    background 0.2s,
    opacity 0.2s;
}

.checkout-btn:hover:not(:disabled) {
  background: #486052;
}

.checkout-btn:disabled {
  opacity: 0.45;

  cursor: not-allowed;
}

/* 空购物车 */
.empty-cart {
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

.empty-cart h2 {
  margin-bottom: 8px;

  color: #30312f;

  font-size: 20px;
}

.empty-cart p {
  margin-bottom: 24px;

  color: #888b84;

  font-size: 14px;
}

.empty-cart button {
  padding: 10px 22px;

  border: none;

  border-radius: 8px;

  background: #587160;

  color: #ffffff;

  cursor: pointer;
}

.empty-cart button:hover {
  background: #486052;
}

/* 响应式 */
@media (max-width: 900px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .summary {
    position: static;
  }
}

@media (max-width: 700px) {
  .main {
    padding: 30px 20px;
  }

  .cart-item {
    grid-template-columns:
      24px 50px 1fr;

    gap: 10px;
  }

  .quantity-control {
    grid-column: 3;
  }

  .item-total {
    display: none;
  }

  .remove-btn {
    grid-column: 3;

    justify-self: start;
  }
}
</style>