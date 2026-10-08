import { reactive, computed } from "vue";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  quantity: number;
}

const STORAGE_KEY = "lifehub-cart";

const state = reactive<{
  items: CartItem[];
}>({
  items: [],
});

/**
 * 从本地存储读取购物车
 */
const loadCart = () => {
  const savedCart = uni.getStorageSync(STORAGE_KEY);

  if (Array.isArray(savedCart)) {
    state.items.push(...savedCart);
  }
};

/**
 * 保存购物车到本地存储
 */
const saveCart = () => {
  uni.setStorageSync(
    STORAGE_KEY,
    state.items,
  );
};

/**
 * 购物车角标
 */
const syncBadge = () => {
  const count = state.items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (count > 0) {
    uni.setTabBarBadge({
      index: 2,
      text: count > 999 ? "999" : String(count),
    });
  } else {
    uni.removeTabBarBadge({
      index: 2,
    });
  }
};

/**
 * 初始化购物车
 */
loadCart();

export const cartStore = {
  items: state.items,

  totalCount: computed(() => {
    return state.items.reduce(
      (total, item) => total + item.quantity,
      0,
    );
  }),

  totalPrice: computed(() => {
    return state.items.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0,
    );
  }),

  addItem(
    product: Omit<CartItem, "quantity">,
  ) {
    const existing = state.items.find(
      (item) => item.id === product.id,
    );

    if (existing) {
      existing.quantity++;
    } else {
      state.items.push({
        ...product,
        quantity: 1,
      });
    }

    saveCart();
  },

  increase(id: number) {
    const item = state.items.find(
      (item) => item.id === id,
    );

    if (item) {
      item.quantity++;
      saveCart();
    }
  },

  decrease(id: number) {
    const item = state.items.find(
      (item) => item.id === id,
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      state.items.splice(
        state.items.indexOf(item),
        1,
      );
    }

    saveCart();
  },

  clear() {
    state.items.splice(
      0,
      state.items.length,
    );

    saveCart();
  },

  syncBadge,
};