import { defineStore } from "pinia";

export type OrderStatus =
  | "待付款"
  | "已完成"
  | "已取消";

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  icon: string;
  quantity: number;

  skuId: string;
  skuOptions: Record<string, string>;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  createTime: string;
  status: OrderStatus;
}

/**
 * 从 localStorage 获取订单
 */
const getOrders = (): Order[] => {
  const data = localStorage.getItem("orders");

  if (!data) {
    return [];
  }

  try {
    const parsed = JSON.parse(data);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((order) => ({
      ...order,

      status:
        order.status === "已完成" ||
        order.status === "已取消" ||
        order.status === "待付款"
          ? order.status
          : "待付款",

      items: Array.isArray(order.items)
        ? order.items.map((item: OrderItem) => ({
            ...item,
            skuId: item.skuId || "default",
            skuOptions:
              item.skuOptions || {}
          }))
        : []
    }));
  } catch {
    return [];
  }
};

export const useOrdersStore = defineStore(
  "orders",
  {
    state: () => ({
      orders: getOrders() as Order[]
    }),

    actions: {
      /**
       * 创建订单
       */
      addOrder(
        order: Omit<Order, "status"> & {
          status?: OrderStatus;
        }
      ) {
        const newOrder: Order = {
          ...order,
          status:
            order.status || "待付款"
        };

        this.orders.unshift(newOrder);

        this.saveOrders();
      },

      /**
       * 付款
       */
      payOrder(id: number) {
        const order =
          this.orders.find(
            (item) => item.id === id
          );

        if (!order) {
          return;
        }

        // 只有待付款订单可以付款
        if (
          order.status !== "待付款"
        ) {
          return;
        }

        order.status = "已完成";

        this.saveOrders();
      },

      /**
       * 取消订单
       */
      cancelOrder(id: number) {
        const order =
          this.orders.find(
            (item) => item.id === id
          );

        if (!order) {
          return;
        }

        // 只有待付款订单可以取消
        if (
          order.status !== "待付款"
        ) {
          return;
        }

        order.status = "已取消";

        this.saveOrders();
      },

      /**
       * 保存订单
       */
      saveOrders() {
        localStorage.setItem(
          "orders",
          JSON.stringify(this.orders)
        );
      },

      /**
       * 清空订单
       */
      clear() {
        this.orders = [];

        localStorage.setItem(
          "orders",
          JSON.stringify([])
        );
      }
    }
  }
);