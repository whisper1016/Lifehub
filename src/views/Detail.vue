<template>
  <div class="detail-page">
    <Navbar />

    <main class="main">
      <button class="back-btn" @click="router.back()">
        ← 返回
      </button>

      <section class="detail-card">
        <!-- 商品图标 -->
        <div class="product-visual">
          <div class="product-icon">
            {{ product.icon }}
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="product-info">
          <div class="title-row">
            <div>
              <div class="category-name">
                {{ getCategoryName(product.category) }}
              </div>

              <h1>
                {{ product.name }}
              </h1>
            </div>

            <button class="favorite-btn" :class="{
              active: favoritesStore.isFavorite(product.id)
            }" @click="toggleFavorite">
              {{
                favoritesStore.isFavorite(product.id)
                  ? "♥"
                  : "♡"
              }}
            </button>
          </div>

          <!-- 评分 -->
          <div class="rating-row">
            <span>
              ⭐ {{ product.rating }}
            </span>

            <span>
              已售 {{ product.sales }}
            </span>
          </div>

          <!-- 商品描述 -->
          <p class="description">
            {{ product.description }}
          </p>

          <!-- SKU -->
          <div v-if="product.skuOptions?.length" class="sku-section">
            <div v-for="option in product.skuOptions" :key="option.name" class="sku-group">
              <div class="sku-title">
                {{ option.name }}
              </div>

              <div class="sku-options">
                <button v-for="value in option.values" :key="value" class="sku-option" :class="{
                  active:
                    selectedOptions[option.name] === value
                }" @click="
                    selectSkuOption(
                      option.name,
                      value
                    )
                    ">
                  {{ value }}
                </button>
              </div>
            </div>
          </div>

          <!-- 当前价格 -->
          <div class="price-section">
            <span class="price">
              ¥{{ currentPrice.toFixed(2) }}
            </span>

            <span v-if="selectedSku" class="stock">
              库存 {{ selectedSku.stock }}
            </span>
          </div>

          <!-- SKU 未匹配 -->
          <div v-if="product.skuOptions?.length && !selectedSku" class="sku-warning">
            当前规格组合暂无库存
          </div>

          <!-- 数量 -->
          <div class="quantity-section">
            <span class="quantity-label">
              数量
            </span>

            <div class="quantity-control">
              <button :disabled="buyQuantity <= 1" @click="decreaseBuyQuantity">
                −
              </button>

              <span>
                {{ buyQuantity }}
              </span>

              <button :disabled="!selectedSku ||
                buyQuantity >= selectedSku.stock
                " @click="increaseBuyQuantity">
                +
              </button>
            </div>
          </div>

          <!-- 基础信息 -->
          <div class="base-info">
            <div>
              营业时间：
              {{ product.businessHours }}
            </div>

            <div>
              地址：
              {{ product.address }}
            </div>
          </div>

          <!-- 操作 -->
          <div class="action-bar">
            <button class="cart-btn" :disabled="!selectedSku ||
              selectedSku.stock <= 0
              " @click="addToCart">
              加入购物车
            </button>

            <button class="buy-btn" :disabled="!selectedSku ||
              selectedSku.stock <= 0
              " @click="openBuyDrawer">
              立即购买
            </button>
          </div>
        </div>
      </section>
    </main>

    <!-- 左侧购买抽屉 -->
    <div v-if="showDrawer" class="drawer-overlay" @click="closeBuyDrawer">
      <aside class="buy-drawer" @click.stop>
        <div class="drawer-header">
          <h2>确认订单</h2>

          <button class="drawer-close" @click="closeBuyDrawer">
            ×
          </button>
        </div>

        <div class="drawer-content">
          <div class="drawer-product">
            <div class="drawer-icon">
              {{ product.icon }}
            </div>

            <div>
              <h3>
                {{ product.name }}
              </h3>

              <div class="drawer-sku">
                {{ skuText }}
              </div>
            </div>
          </div>

          <div class="drawer-section">
            <div class="drawer-row">
              <span>单价</span>

              <span>
                ¥{{ currentPrice.toFixed(2) }}
              </span>
            </div>

            <div class="drawer-row">
              <span>数量</span>

              <div class="quantity-control">
                <button :disabled="buyQuantity <= 1" @click="decreaseBuyQuantity">
                  −
                </button>

                <span>
                  {{ buyQuantity }}
                </span>

                <button :disabled="!selectedSku ||
                  buyQuantity >= selectedSku.stock
                  " @click="increaseBuyQuantity">
                  +
                </button>
              </div>
            </div>

            <div class="drawer-row">
              <span>小计</span>

              <span>
                ¥{{ buyTotalPrice.toFixed(2) }}
              </span>
            </div>
          </div>

          <div class="drawer-total">
            <span>订单总额</span>

            <strong>
              ¥{{ buyTotalPrice.toFixed(2) }}
            </strong>
          </div>
        </div>

        <div class="drawer-footer">
          <button class="drawer-confirm" :disabled="!selectedSku" @click="confirmBuy">
            确认下单
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  watch
} from "vue";

import {
  useRoute,
  useRouter
} from "vue-router";

import Navbar from "../components/Navbar.vue";

import { products } from "../../shared/data/products";

import { getCategoryName } from "../../shared/utils/category";

import { useCartStore } from "../stores/cart";
import { useFavoritesStore } from "../stores/favorites";
import { useOrdersStore } from "../stores/orders";

import { useAuthStore } from "../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();
const ordersStore = useOrdersStore();

/* =========================
   商品
========================= */

const product = computed(() => {
  const id = Number(route.params.id);

  return (
    products.find(
      (item) => item.id === id
    ) || products[0]
  );
});

/* =========================
   SKU
========================= */

const selectedOptions =
  ref<Record<string, string>>({});

/**
 * 初始化 SKU
 * 默认选择每个规格的第一个值
 */
const initializeSku = () => {
  const result: Record<string, string> = {};

  product.value.skuOptions.forEach(
    (option) => {
      if (option.values.length > 0) {
        result[option.name] =
          option.values[0];
      }
    }
  );

  selectedOptions.value = result;
};

/**
 * 商品发生变化时重新初始化 SKU
 */
watch(
  () => product.value.id,
  () => {
    initializeSku();
  },
  {
    immediate: true
  }
);

/**
 * 当前选中的 SKU
 */
const selectedSku = computed(() => {
  return product.value.skus.find(
    (sku) => {
      return product.value.skuOptions.every(
        (option) => {
          return (
            sku.options[option.name] ===
            selectedOptions.value[
            option.name
            ]
          );
        }
      );
    }
  );
});

/**
 * 当前价格
 */
const currentPrice = computed(() => {
  return (
    selectedSku.value?.price ??
    product.value.price
  );
});

/**
 * 当前 SKU 文本
 */
const skuText = computed(() => {
  return product.value.skuOptions
    .map((option) => {
      const value =
        selectedOptions.value[
        option.name
        ];

      return `${option.name}：${value || "未选择"}`;
    })
    .join(" / ");
});

/**
 * 选择规格
 */
const selectSkuOption = (
  name: string,
  value: string
) => {
  selectedOptions.value[name] =
    value;

  // 更换规格后重新从 1 件开始
  buyQuantity.value = 1;
};

/* =========================
   数量
========================= */

const buyQuantity = ref(1);

const decreaseBuyQuantity = () => {
  if (buyQuantity.value > 1) {
    buyQuantity.value--;
  }
};

const increaseBuyQuantity = () => {
  if (!selectedSku.value) {
    return;
  }

  const stock =
    selectedSku.value.stock;

  if (
    buyQuantity.value < stock
  ) {
    buyQuantity.value++;
  }
};

/* =========================
   购买抽屉
========================= */

const showDrawer = ref(false);

const buyTotalPrice = computed(() => {
  return (
    currentPrice.value *
    buyQuantity.value
  );
});

const openBuyDrawer = () => {
  if (!selectedSku.value) {
    alert("请选择有效的商品规格");
    return;
  }

  if (selectedSku.value.stock <= 0) {
    alert("该规格暂时无库存");
    return;
  }

  showDrawer.value = true;
};

const closeBuyDrawer = () => {
  showDrawer.value = false;
};

/* =========================
   收藏
========================= */

const toggleFavorite = () => {
  favoritesStore.toggle(
    product.value.id
  );
};

/* =========================
   加入购物车
========================= */

const addToCart = () => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: "/login",
      query: {
        redirect: route.fullPath
      }
    });

    return;
  }
  if (!selectedSku.value) {
    alert("请选择有效的商品规格");
    return;
  }

  if (
    selectedSku.value.stock <= 0
  ) {
    alert("该规格暂时无库存");
    return;
  }

  const success =
    cartStore.addItem({
      id: product.value.id,
      name: product.value.name,
      price: selectedSku.value.price,
      icon: product.value.icon,
      skuId: selectedSku.value.id,
      skuOptions:
        selectedSku.value.options,
      stock: selectedSku.value.stock,
      quantity: buyQuantity.value
    });

  if (!success) {
    alert("该规格库存不足");
    return;
  }

  alert(
    `已加入购物车\n${skuText.value}\n数量：${buyQuantity.value}`
  );
};

/* =========================
   立即购买
========================= */

const confirmBuy = () => {
  if (!authStore.isLoggedIn) {
    router.push({
      path: "/login",
      query: {
        redirect: route.fullPath
      }
    });

    return;
  }

  if (!selectedSku.value) {
    alert("请选择有效的商品规格");
    return;
  }

  if (
    selectedSku.value.stock <
    buyQuantity.value
  ) {
    alert("商品库存不足");
    return;
  }

  const order = {
    id: Date.now(),

    items: [
      {
        id: product.value.id,
        name: product.value.name,
        price: selectedSku.value.price,
        icon: product.value.icon,
        quantity: buyQuantity.value,

        skuId: selectedSku.value.id,

        skuOptions:
          selectedSku.value.options
      }
    ],

    total: buyTotalPrice.value,

    createTime:
      new Date().toLocaleString()
  };

  ordersStore.addOrder(order);

  showDrawer.value = false;

  alert("订单创建成功");

  router.push("/orders");
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #f2f1ec;
}

.main {
  max-width: 1100px;
  margin: 0 auto;
  padding: 36px 40px 60px;
}

.back-btn {
  margin-bottom: 24px;
  padding: 8px 0;
  border: none;
  background: transparent;
  color: #687169;
  font-size: 14px;
  cursor: pointer;
}

.back-btn:hover {
  color: #587160;
}

.detail-card {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 48px;
  padding: 36px;
  background: #f8f7f2;
  border: 1px solid #e4e2db;
  border-radius: 18px;
}

.product-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 360px;
  background: #eeece6;
  border-radius: 16px;
}

.product-icon {
  font-size: 110px;
}

.product-info {
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.category-name {
  margin-bottom: 8px;
  color: #587160;
  font-size: 13px;
}

.title-row h1 {
  margin: 0;
  font-size: 30px;
  color: #30312f;
}

.favorite-btn {
  width: 42px;
  height: 42px;
  border: 1px solid #dedcd4;
  border-radius: 50%;
  background: #f2f1ec;
  color: #777a73;
  font-size: 20px;
  cursor: pointer;
}

.favorite-btn.active {
  color: #c46b61;
}

.rating-row {
  display: flex;
  gap: 20px;
  margin-top: 15px;
  color: #777a73;
  font-size: 13px;
}

.description {
  margin: 20px 0;
  color: #73776f;
  line-height: 1.8;
  font-size: 14px;
}

/* SKU */

.sku-section {
  display: flex;
  flex-direction: column;
  gap: 22px;
  margin: 24px 0;
}

.sku-title {
  margin-bottom: 10px;
  color: #555a54;
  font-size: 14px;
}

.sku-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.sku-option {
  padding: 8px 16px;
  border: 1px solid #dddcd5;
  border-radius: 8px;
  background: #f8f7f2;
  color: #666863;
  font-size: 13px;
  cursor: pointer;
}

.sku-option:hover {
  border-color: #587160;
  color: #587160;
}

.sku-option.active {
  border-color: #587160;
  background: #587160;
  color: #ffffff;
}

.sku-warning {
  margin-top: -12px;
  color: #b36d62;
  font-size: 12px;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.price {
  color: #587160;
  font-size: 30px;
  font-weight: 700;
}

.stock {
  color: #999b95;
  font-size: 12px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 24px 0;
}

.quantity-label {
  color: #555a54;
  font-size: 14px;
}

.quantity-control {
  display: flex;
  align-items: center;
  border: 1px solid #dddcd5;
  border-radius: 8px;
  overflow: hidden;
}

.quantity-control button {
  width: 34px;
  height: 34px;
  border: none;
  background: #eeece6;
  color: #555a54;
  font-size: 18px;
  cursor: pointer;
}

.quantity-control button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.quantity-control span {
  width: 42px;
  text-align: center;
  color: #30312f;
  font-size: 14px;
}

.base-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #f2f1ec;
  border-radius: 10px;
  color: #777a73;
  font-size: 13px;
}

.action-bar {
  display: flex;
  gap: 12px;
  margin-top: 26px;
}

.cart-btn,
.buy-btn {
  flex: 1;
  height: 44px;
  border-radius: 9px;
  font-size: 14px;
  cursor: pointer;
}

.cart-btn {
  border: 1px solid #587160;
  background: #f8f7f2;
  color: #587160;
}

.buy-btn {
  border: 1px solid #587160;
  background: #587160;
  color: #ffffff;
}

.cart-btn:disabled,
.buy-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 抽屉 */

.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(40, 45, 40, 0.25);
}

.buy-drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 430px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f8f7f2;
  box-shadow:
    8px 0 30px rgba(50, 60, 50, 0.12);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 24px;
  border-bottom: 1px solid #e4e2db;
}

.drawer-header h2 {
  margin: 0;
  color: #30312f;
  font-size: 20px;
}

.drawer-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #777a73;
  font-size: 24px;
  cursor: pointer;
}

.drawer-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.drawer-product {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 28px;
}

.drawer-icon {
  width: 58px;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: #eeece6;
  font-size: 28px;
}

.drawer-product h3 {
  margin-bottom: 8px;
  color: #30312f;
  font-size: 15px;
}

.drawer-sku {
  color: #888b84;
  font-size: 12px;
  line-height: 1.6;
}

.drawer-section {
  padding: 18px 0;
  border-top: 1px solid #ebe9e2;
  border-bottom: 1px solid #ebe9e2;
}

.drawer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  color: #777a73;
  font-size: 14px;
}

.drawer-row:last-child {
  margin-bottom: 0;
}

.drawer-total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
}

.drawer-total span {
  color: #555a54;
  font-size: 14px;
}

.drawer-total strong {
  color: #587160;
  font-size: 26px;
}

.drawer-footer {
  padding: 20px 24px;
  border-top: 1px solid #e4e2db;
}

.drawer-confirm {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 9px;
  background: #587160;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
}

.drawer-confirm:hover {
  background: #486052;
}

.drawer-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 800px) {
  .detail-card {
    grid-template-columns: 1fr;
  }

  .product-visual {
    min-height: 260px;
  }

  .buy-drawer {
    width: min(430px, 90%);
  }
}
</style>