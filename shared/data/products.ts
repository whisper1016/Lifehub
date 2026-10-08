import type { Product } from "../types/product";
import { categories } from "./categories";

export const products: Product[] = [
  {
    id: 1,
    name: "城市特色餐厅",
    category: 2,
    description:
      "精选本地特色美食，提供舒适用餐环境，适合朋友聚餐、家庭聚餐等场景。",
    price: 88,
    rating: 4.9,
    sales: 328,
    icon: "🍜",
    businessHours: "10:00 - 22:00",
    address: "杭州市西湖区 LifeHub 广场",

    skuOptions: [
      {
        name: "套餐",
        values: [
          "双人套餐",
          "四人套餐"
        ]
      },
      {
        name: "口味",
        values: [
          "微辣",
          "不辣"
        ]
      }
    ],

    skus: [
      {
        id: "food-1-1",
        options: {
          套餐: "双人套餐",
          口味: "微辣"
        },
        price: 88,
        stock: 50
      },
      {
        id: "food-1-2",
        options: {
          套餐: "双人套餐",
          口味: "不辣"
        },
        price: 88,
        stock: 40
      },
      {
        id: "food-1-3",
        options: {
          套餐: "四人套餐",
          口味: "微辣"
        },
        price: 158,
        stock: 30
      },
      {
        id: "food-1-4",
        options: {
          套餐: "四人套餐",
          口味: "不辣"
        },
        price: 158,
        stock: 30
      }
    ]
  },

  {
    id: 2,
    name: "精品城市酒店",
    category: 3,
    description:
      "舒适住宿体验，交通便利，适合短途旅行和商务出行。",
    price: 268,
    rating: 4.8,
    sales: 256,
    icon: "🏨",
    businessHours: "全天营业",
    address: "杭州市西湖区湖滨路",

    skuOptions: [
      {
        name: "房型",
        values: [
          "标准大床房",
          "豪华大床房"
        ]
      },
      {
        name: "入住",
        values: [
          "1晚",
          "2晚"
        ]
      }
    ],

    skus: [
      {
        id: "hotel-2-1",
        options: {
          房型: "标准大床房",
          入住: "1晚"
        },
        price: 268,
        stock: 20
      },
      {
        id: "hotel-2-2",
        options: {
          房型: "标准大床房",
          入住: "2晚"
        },
        price: 508,
        stock: 15
      },
      {
        id: "hotel-2-3",
        options: {
          房型: "豪华大床房",
          入住: "1晚"
        },
        price: 368,
        stock: 10
      },
      {
        id: "hotel-2-4",
        options: {
          房型: "豪华大床房",
          入住: "2晚"
        },
        price: 698,
        stock: 8
      }
    ]
  },

  {
    id: 3,
    name: "城市休闲空间",
    category: 4,
    description:
      "适合朋友聚会、休闲娱乐，提供舒适轻松的活动空间。",
    price: 128,
    rating: 4.7,
    sales: 189,
    icon: "🎮",
    businessHours: "10:00 - 23:00",
    address: "杭州市拱墅区城市广场",

    skuOptions: [
      {
        name: "门票",
        values: [
          "普通票",
          "VIP票"
        ]
      },
      {
        name: "时间",
        values: [
          "工作日",
          "周末"
        ]
      }
    ],

    skus: [
      {
        id: "fun-3-1",
        options: {
          门票: "普通票",
          时间: "工作日"
        },
        price: 128,
        stock: 100
      },
      {
        id: "fun-3-2",
        options: {
          门票: "普通票",
          时间: "周末"
        },
        price: 148,
        stock: 80
      },
      {
        id: "fun-3-3",
        options: {
          门票: "VIP票",
          时间: "工作日"
        },
        price: 198,
        stock: 30
      },
      {
        id: "fun-3-4",
        options: {
          门票: "VIP票",
          时间: "周末"
        },
        price: 228,
        stock: 20
      }
    ]
  },

  {
    id: 4,
    name: "生活好物商城",
    category: 5,
    description:
      "精选热门生活好物，方便日常购物，品质生活从这里开始。",
    price: 59,
    rating: 4.8,
    sales: 512,
    icon: "🛍️",
    businessHours: "09:00 - 22:00",
    address: "杭州市上城区生活广场",

    skuOptions: [
      {
        name: "颜色",
        values: [
          "米白色",
          "浅绿色"
        ]
      },
      {
        name: "规格",
        values: [
          "标准款",
          "升级款"
        ]
      }
    ],

    skus: [
      {
        id: "shop-4-1",
        options: {
          颜色: "米白色",
          规格: "标准款"
        },
        price: 59,
        stock: 100
      },
      {
        id: "shop-4-2",
        options: {
          颜色: "米白色",
          规格: "升级款"
        },
        price: 79,
        stock: 80
      },
      {
        id: "shop-4-3",
        options: {
          颜色: "浅绿色",
          规格: "标准款"
        },
        price: 59,
        stock: 90
      },
      {
        id: "shop-4-4",
        options: {
          颜色: "浅绿色",
          规格: "升级款"
        },
        price: 79,
        stock: 60
      }
    ]
  },

  {
    id: 5,
    name: "本地人气火锅",
    category: 2,
    description:
      "经典火锅套餐，精选食材，适合朋友聚餐和家庭聚会。",
    price: 128,
    rating: 4.9,
    sales: 436,
    icon: "🍲",
    businessHours: "11:00 - 23:00",
    address: "杭州市西湖区美食街",

    skuOptions: [
      {
        name: "人数",
        values: [
          "2人餐",
          "4人餐"
        ]
      },
      {
        name: "锅底",
        values: [
          "经典番茄",
          "麻辣锅底"
        ]
      }
    ],

    skus: [
      {
        id: "hotpot-5-1",
        options: {
          人数: "2人餐",
          锅底: "经典番茄"
        },
        price: 128,
        stock: 60
      },
      {
        id: "hotpot-5-2",
        options: {
          人数: "2人餐",
          锅底: "麻辣锅底"
        },
        price: 138,
        stock: 60
      },
      {
        id: "hotpot-5-3",
        options: {
          人数: "4人餐",
          锅底: "经典番茄"
        },
        price: 228,
        stock: 40
      },
      {
        id: "hotpot-5-4",
        options: {
          人数: "4人餐",
          锅底: "麻辣锅底"
        },
        price: 238,
        stock: 40
      }
    ]
  },

  {
    id: 6,
    name: "城市精选民宿",
    category: 3,
    description:
      "温馨舒适的城市民宿。",
    price: 198,
    rating: 4.7,
    sales: 436,
    icon: "🏠",
    businessHours: "11:00 - 23:00",
    address: "杭州市临平区民宿区",

    skuOptions: [
      {
        name: "房型",
        values: [
          "舒适大床",
          "家庭套房"
        ]
      },
      {
        name: "入住",
        values: [
          "1晚",
          "2晚"
        ]
      }
    ],

    skus: [
      {
        id: "home-6-1",
        options: {
          房型: "舒适大床",
          入住: "1晚"
        },
        price: 198,
        stock: 15
      },
      {
        id: "home-6-2",
        options: {
          房型: "舒适大床",
          入住: "2晚"
        },
        price: 378,
        stock: 12
      },
      {
        id: "home-6-3",
        options: {
          房型: "家庭套房",
          入住: "1晚"
        },
        price: 328,
        stock: 8
      },
      {
        id: "home-6-4",
        options: {
          房型: "家庭套房",
          入住: "2晚"
        },
        price: 628,
        stock: 6
      }
    ]
  }
];

export const searchProducts = (keyword: string) => {
  const value = keyword.trim().toLowerCase();

  if (!value) {
    return products;
  }

  return products.filter((item) => {
    const category = categories.find(
      (category) => category.id === item.category
    );

    const categoryName = category?.name || "";

    return (
      item.name.toLowerCase().includes(value) ||
      categoryName.toLowerCase().includes(value) ||
      item.description.toLowerCase().includes(value)
    );
  });
};