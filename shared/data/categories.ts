export interface Category {
  id: number;
  name: string;
  icon: string;
}

export const categories = [
  {
    id: 1,
    name: "全部",
    icon: "📋",
    description: "浏览全部商品",
  },
  {
    id: 2,
    name: "美食",
    icon: "🍜",
    description: "发现城市里的特色美食",
  },
  {
    id: 3,
    name: "酒店",
    icon: "🏨",
    description: "寻找舒适的住宿体验",
  },
  {
    id: 4,
    name: "娱乐",
    icon: "🎮",
    description: "探索城市休闲娱乐",
  },
  {
    id: 5,
    name: "购物",
    icon: "🛍️",
    description: "发现城市里的购物好去处",
  }
];