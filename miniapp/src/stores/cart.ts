import { reactive, computed } from "vue";
import { authStore } from "./auth";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  quantity: number;
  skuId: string;
  skuOptions: Record<string, string>;
  stock: number;
}

const state = reactive<{ items: CartItem[] }>({
  items: [],
});

/**
 * 同步购物车角标
 */
const syncBadge = () => {
  const count = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (count > 0) {
    uni.setTabBarBadge({
      index: 2,
      text: count > 99 ? "99+" : String(count),
    });
  } else {
    uni.removeTabBarBadge({
      index: 2,
    });
  }
};

export const cartStore = {
  /**
   * 当前购物车商品
   */
  items: state.items,

  /**
   * 商品总数量
   */
  totalCount: computed(() =>
    state.items.reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  ),

  /**
   * 商品总价
   */
  totalPrice: computed(() =>
    state.items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    ),
  ),

  /**
   * 加入购物车
   */
  addItem(
    product: Omit<CartItem, "quantity"> & {
      quantity?: number;
    },
  ) {
    // 未登录不能加入购物车
    if (!authStore.isLoggedIn.value) {
      uni.navigateTo({
        url: "/pages/login/login",
      });

      return false;
    }

    const quantity = product.quantity || 1;

    const existing = state.items.find(
      (item) =>
        item.id === product.id &&
        item.skuId === product.skuId,
    );

    // 已存在相同商品 + SKU
    if (existing) {
      const newQuantity =
        existing.quantity + quantity;

      // 超出库存
      if (newQuantity > existing.stock) {
        uni.showToast({
          title: "库存不足",
          icon: "none",
        });

        return false;
      }

      existing.quantity = newQuantity;
    } else {
      // 新商品超出库存
      if (quantity > product.stock) {
        uni.showToast({
          title: "库存不足",
          icon: "none",
        });

        return false;
      }

      state.items.push({
        ...product,
        quantity,
      });
    }

    syncBadge();

    return true;
  },

  /**
   * 增加商品数量
   */
  increase(id: number, skuId: string) {
    const item = state.items.find(
      (item) =>
        item.id === id &&
        item.skuId === skuId,
    );

    if (!item) {
      return;
    }

    if (item.quantity >= item.stock) {
      uni.showToast({
        title: "已达到库存上限",
        icon: "none",
      });

      return;
    }

    item.quantity++;

    syncBadge();
  },

  /**
   * 减少商品数量
   */
  decrease(id: number, skuId: string) {
    const item = state.items.find(
      (item) =>
        item.id === id &&
        item.skuId === skuId,
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      const index = state.items.indexOf(item);

      if (index !== -1) {
        state.items.splice(index, 1);
      }
    }

    syncBadge();
  },

  /**
   * 删除商品
   */
  removeItem(id: number, skuId: string) {
    const index = state.items.findIndex(
      (item) =>
        item.id === id &&
        item.skuId === skuId,
    );

    if (index === -1) {
      return;
    }

    state.items.splice(index, 1);

    syncBadge();
  },

  /**
   * 清空购物车
   */
  clear() {
    state.items.splice(
      0,
      state.items.length,
    );

    syncBadge();
  },

  /**
   * 同步角标
   */
  syncBadge,
};