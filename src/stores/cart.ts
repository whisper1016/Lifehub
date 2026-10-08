import { computed, ref } from "vue";
import { defineStore } from "pinia";

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

const getCartItems = (): CartItem[] => {
  const data = localStorage.getItem("cart");

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((item) => ({
      ...item,
      skuId: item.skuId || "default",
      skuOptions: item.skuOptions || {},
      stock:
        typeof item.stock === "number"
          ? item.stock
          : 9999
    }));
  } catch {
    return [];
  }
};

export const useCartStore = defineStore("cart", () => {
  const items = ref<CartItem[]>(
    getCartItems()
  );

  const save = () => {
    localStorage.setItem(
      "cart",
      JSON.stringify(items.value)
    );
  };

  const totalCount = computed(() =>
    items.value.reduce(
      (total, item) =>
        total + item.quantity,
      0
    )
  );

  const totalPrice = computed(() =>
    items.value.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    )
  );

  // 加入购物车
  const addItem = (
    product: Omit<CartItem, "quantity"> & {
      quantity?: number;
    }
  ) => {
    const quantity =
      product.quantity || 1;

    const existing = items.value.find(
      (item) =>
        item.id === product.id &&
        item.skuId === product.skuId
    );

    if (existing) {
      const newQuantity =
        existing.quantity + quantity;

      if (
        newQuantity >
        existing.stock
      ) {
        return false;
      }

      existing.quantity =
        newQuantity;
    } else {
      if (
        quantity >
        product.stock
      ) {
        return false;
      }

      items.value.push({
        ...product,
        quantity
      });
    }

    save();

    return true;
  };

  // 增加数量
  const increase = (
    id: number,
    skuId: string
  ) => {
    const item = items.value.find(
      (item) =>
        item.id === id &&
        item.skuId === skuId
    );

    if (!item) {
      return;
    }

    if (
      item.quantity >=
      item.stock
    ) {
      return;
    }

    item.quantity++;

    save();
  };

  // 减少数量
  const decrease = (
    id: number,
    skuId: string
  ) => {
    const item = items.value.find(
      (item) =>
        item.id === id &&
        item.skuId === skuId
    );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {
      item.quantity--;
    } else {
      items.value =
        items.value.filter(
          (item) =>
            !(
              item.id === id &&
              item.skuId === skuId
            )
        );
    }

    save();
  };

  // 删除一个 SKU
  const removeItem = (
    id: number,
    skuId: string
  ) => {
    items.value =
      items.value.filter(
        (item) =>
          !(
            item.id === id &&
            item.skuId === skuId
          )
      );

    save();
  };

  // 删除多个 SKU
  const removeItems = (
    keys: string[]
  ) => {
    items.value =
      items.value.filter(
        (item) =>
          !keys.includes(
            `${item.id}-${item.skuId}`
          )
      );

    save();
  };

  // 清空购物车
  const clear = () => {
    items.value = [];

    save();
  };

  return {
    items,
    totalCount,
    totalPrice,
    addItem,
    increase,
    decrease,
    removeItem,
    removeItems,
    clear
  };
});