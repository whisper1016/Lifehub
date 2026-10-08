export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductSku {
  id: string;
  options: Record<string, string>;
  price: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  // 分类ID
  category: number;
  // categoryName: string;
  description: string;
  price: number;
  rating: number;
  sales: number;
  icon: string;
  businessHours: string;
  address: string;

  // SKU 属性
  skuOptions: ProductOption[];

  // SKU 组合
  skus: ProductSku[];
}