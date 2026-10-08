import { reactive, computed } from "vue";
import { authStore } from "./auth";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  quantity: number;

  skuId?: string;
  skuOptions?: Record<string, string>;
  stock?: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalCount: number;
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  statusText: string;
  createTime: string;
}

/**
 * 根据当前登录账号生成订单 Storage Key
 */
const getStorageKey = () => {
  const username = authStore.user.value?.username;

  if (!username) {
    return "";
  }

  return `lifehub-orders-${username}`;
};

const state = reactive<{ orders: Order[] }>({
  orders: [],
});

/**
 * 加载当前账号订单
 */
const loadOrders = () => {
  // 先清空内存中的订单
  state.orders.splice(
    0,
    state.orders.length,
  );

  const key = getStorageKey();

  // 未登录
  if (!key) {
    return;
  }

  const savedOrders = uni.getStorageSync(key);

  if (!Array.isArray(savedOrders)) {
    return;
  }

  const orders = savedOrders.map((order) => ({
    ...order,

    status:
      order.status === "completed" ||
      order.status === "cancelled"
        ? order.status
        : "pending",

    statusText:
      order.status === "completed"
        ? "已完成"
        : order.status === "cancelled"
          ? "已取消"
          : "待付款",

    items: Array.isArray(order.items)
      ? order.items.map((item: OrderItem) => ({
          ...item,

          skuId: item.skuId || "default",

          skuOptions:
            item.skuOptions || {},

          stock:
            typeof item.stock === "number"
              ? item.stock
              : 9999,
        }))
      : [],
  }));

  state.orders.push(...orders);
};

/**
 * 保存当前账号订单
 */
const saveOrders = () => {
  const key = getStorageKey();

  // 未登录时不保存
  if (!key) {
    return;
  }

  uni.setStorageSync(
    key,
    state.orders,
  );
};

export const ordersStore = {
  /**
   * 当前账号订单
   */
  orders: state.orders,

  /**
   * 待付款订单数量
   */
  pendingCount: computed(
    () =>
      state.orders.filter(
        (order) =>
          order.status === "pending",
      ).length,
  ),

  /**
   * 创建订单
   */
  createOrder(items: OrderItem[]) {
    if (!authStore.isLoggedIn.value) {
      return null;
    }

    const totalCount = items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    );

    const totalPrice = items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0,
    );

    const order: Order = {
      id: `LH${Date.now()}`,

      items: JSON.parse(
        JSON.stringify(items),
      ),

      totalCount,

      totalPrice,

      status: "pending",

      statusText: "待付款",

      createTime:
        new Date().toLocaleString(),
    };

    state.orders.unshift(order);

    saveOrders();

    return order;
  },

  /**
   * 支付订单
   */
  payOrder(id: string) {
    const order = state.orders.find(
      (item) => item.id === id,
    );

    if (!order) {
      return;
    }

    if (order.status !== "pending") {
      return;
    }

    order.status = "completed";
    order.statusText = "已完成";

    saveOrders();
  },

  /**
   * 取消订单
   */
  cancelOrder(id: string) {
    const order = state.orders.find(
      (item) => item.id === id,
    );

    if (!order) {
      return;
    }

    // 只有待付款订单可以取消
    if (order.status !== "pending") {
      return;
    }

    order.status = "cancelled";
    order.statusText = "已取消";

    saveOrders();
  },

  /**
   * 重新加载当前账号订单
   */
  reload() {
    loadOrders();
  },

  /**
   * 退出登录时清空内存订单
   *
   * 注意：
   * 不删除当前账号的 Storage 数据。
   * 下次重新登录后可以再次 reload。
   */
  logoutClear() {
    state.orders.splice(
      0,
      state.orders.length,
    );
  },

  /**
   * 清空当前账号全部订单
   */
  clear() {
    state.orders.splice(
      0,
      state.orders.length,
    );

    saveOrders();
  },
};