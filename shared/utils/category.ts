import { categories } from "../data/categories";

/**
 * 根据分类 ID 获取分类名称
 */
export const getCategoryName = (categoryId: number): string => {
  const category = categories.find(
    (item) => item.id === categoryId
  );

  return category?.name || "未知分类";
};