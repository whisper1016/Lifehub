<template>
  <div class="category-page">
    <Navbar />

    <main class="main">
      <!-- 页面标题 -->
      <section class="page-header">
        <div>
          <h1>商品分类</h1>

          <p v-if="searchKeyword">
            搜索“{{ searchKeyword }}”的结果
          </p>

          <p v-else>
            发现城市生活中的好去处
          </p>
        </div>
      </section>

      <!-- 分类 + 搜索 -->
      <section class="category-section">
        <div class="category-header">
          <!-- 分类 Tab -->
          <div class="category-tabs">
            <button v-for="category in categories" :key="category.id" :class="[
              'category-btn',
              {
                active: activeCategory === category.id
              }
            ]" @click="selectCategory(category.id)">
              {{ category.name }}
            </button>
          </div>

          <!-- 搜索框 -->
          <div class="search-box">
            <div class="search-input-wrap">
              <input v-model="keyword" type="text" placeholder="搜索商品..." @keyup.enter="handleSearch" />

              <button v-if="keyword" class="clear-btn" @click="clearKeyword">
                ×
              </button>
            </div>

            <button class="search-btn" @click="handleSearch">
              搜索
            </button>
          </div>
        </div>
      </section>

      <!-- 商品结果 -->
      <section class="result-section">
        <!-- 有搜索结果 / 正常分类商品 -->
        <template v-if="filteredProducts.length > 0">
          <div class="result-header">
            <h2>
              {{ searchKeyword ? "搜索结果" : "全部商品" }}
            </h2>

            <span>
              共 {{ filteredProducts.length }} 件
            </span>
          </div>

          <div class="product-grid">
            <div v-for="item in filteredProducts" :key="item.id" class="product-card" @click="goDetail(item.id)">
              <div class="product-icon">
                {{ item.icon }}
              </div>

              <div class="product-content">
                <div class="product-top">
                  <h3>
                    {{ item.name }}
                  </h3>

                  <span class="rating">
                    ⭐ {{ item.rating }}
                  </span>
                </div>

                <div class="category-name">
                  {{ getCategoryName(item.category) }}
                </div>

                <p class="description">
                  {{ item.description }}
                </p>

                <div class="product-bottom">
                  <span class="price">
                    ¥{{ item.price }}
                  </span>

                  <span class="sales">
                    已售 {{ item.sales }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 搜索无结果 -->
        <template v-else-if="searchKeyword">
          <div class="empty-result">
            <div class="empty-icon">
              🔍
            </div>

            <h3>
              没有找到相关商品
            </h3>

            <p>
              没有找到“{{ searchKeyword }}”相关的商品
            </p>

            <button @click="clearSearch">
              查看全部商品
            </button>
          </div>

          <!-- 推荐商品 -->
          <div class="recommend-section">
            <div class="recommend-header">
              <div>
                <h2>
                  为你推荐
                </h2>

                <p>
                  换个商品看看，也许有你喜欢的
                </p>
              </div>
            </div>

            <div class="product-grid">
              <div v-for="item in recommendedProducts" :key="item.id" class="product-card" @click="goDetail(item.id)">
                <div class="product-icon">
                  {{ item.icon }}
                </div>

                <div class="product-content">
                  <div class="product-top">
                    <h3>
                      {{ item.name }}
                    </h3>

                    <span class="rating">
                      ⭐ {{ item.rating }}
                    </span>
                  </div>

                  <div class="category-name">
                    {{ getCategoryName(item.category) }}
                  </div>

                  <p class="description">
                    {{ item.description }}
                  </p>

                  <div class="product-bottom">
                    <span class="price">
                      ¥{{ item.price }}
                    </span>

                    <span class="sales">
                      已售 {{ item.sales }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </section>
    </main>
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

import {
  products
} from "../../shared/data/products";

import { categories } from "../../shared/data/categories";
import { getCategoryName } from "../../shared/utils/category";

/**
 * Router
 */
const route = useRoute();
const router = useRouter();
// /**
//  * 根据分类 ID 获取分类名称
//  */
// const getCategoryName = (categoryId: number) => {
//   const category = categories.find(
//     (item) => item.id === categoryId
//   );

//   return category?.name || "未知分类";
// };

/**
 * 分类数据
 *
 * 注意：
 * categories 必须在 watch 使用之前初始化。
 */
// const categories = [
//   {
//     id: 1,
//     name: "全部"
//   },
//   {
//     id: 2,
//     name: "美食"
//   },
//   {
//     id: 3,
//     name: "酒店"
//   },
//   {
//     id: 4,
//     name: "娱乐"
//   },
//   {
//     id: 5,
//     name: "购物"
//   }
// ];

/**
 * 搜索关键词
 */
const keyword = ref(
  String(route.query.keyword || "")
);

/**
 * 当前分类
 */
// const activeCategory = ref(
//   categories.find((category) => category.isAll)?.id ?? 1
// );
const activeCategory = ref(1);


/**
 * URL 中的分类参数
 */
const categoryQuery = computed(() => {
  return Number(
    route.query.category || 1
  );
});

/**
 * URL 分类变化时，
 * 同步当前选中的分类
 */
watch(
  categoryQuery,
  (value) => {
    const exists = categories.some(
      (category) =>
        category.id === value
    );

    activeCategory.value = exists
      ? value
      : 1;
  },
  {
    immediate: true
  }
);

/**
 * URL 搜索关键词变化时，
 * 同步搜索框
 */
watch(
  () => route.query.keyword,
  (value) => {
    keyword.value = String(
      value || ""
    );
  },
  {
    immediate: true
  }
);

/**
 * 当前搜索关键词
 */
const searchKeyword = computed(() => {
  return String(
    route.query.keyword || ""
  ).trim();
});

/**
 * 商品筛选
 */
const filteredProducts = computed(() => {
  let result = products;

  /**
   * 分类筛选
   */
  if (activeCategory.value !== 1) {
  result = result.filter(
    (item) => item.category === activeCategory.value
  );
}

  /**
   * 搜索筛选
   */
  const searchValue =
    searchKeyword.value.toLowerCase();

  if (searchValue) {
    result = result.filter((item) => {
      return (
        item.name
          .toLowerCase()
          .includes(searchValue) ||
        getCategoryName(item.category)
          .toLowerCase()
          .includes(searchValue) ||
        item.description
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }

  return result;
});

/**
 * 推荐商品
 */
const recommendedProducts =
  computed(() => {
    return [...products]
      .sort(
        (a, b) =>
          b.sales - a.sales
      )
      .slice(0, 3);
  });

/**
 * 点击分类
 */
const selectCategory = (
  id: number
) => {
  activeCategory.value = id;

  const query: Record<
    string,
    string
  > = {};

  /**
   * “全部”不需要 category 参数
   */
  if (id !== 1) {
  query.category = String(id);
}

  /**
   * 保留当前搜索关键词
   */
  if (keyword.value.trim()) {
    query.keyword =
      keyword.value.trim();
  }

  router.push({
    path: "/category",
    query
  });
};

/**
 * 点击搜索 / 回车搜索
 */
const handleSearch = () => {
  const value =
    keyword.value.trim();

  const query: Record<
    string,
    string
  > = {};

  /**
   * 保留当前分类
   */
  if (activeCategory.value !== 1) {
  query.category = String(activeCategory.value);
}

  /**
   * 有关键词才添加 keyword
   */
  if (value) {
    query.keyword = value;
  }

  router.push({
    path: "/category",
    query
  });
};

/**
 * 清除搜索框
 */
const clearKeyword = () => {
  keyword.value = "";

  const query: Record<
    string,
    string
  > = {};

  /**
   * 清除搜索时，
   * 保留当前分类
   */
  if (activeCategory.value !== 1) {
    query.category =
      String(activeCategory.value);
  }

  router.push({
    path: "/category",
    query
  });
};

/**
 * 清空搜索并返回全部商品
 */
const clearSearch = () => {
  keyword.value = "";
  activeCategory.value = 1;

  router.push({
    path: "/category"
  });
};

/**
 * 商品详情
 */
const goDetail = (
  id: number
) => {
  router.push(
    `/detail/${id}`
  );
};
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  background: #f2f1ec;
}

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 8px;
  font-size: 30px;
  color: #30312f;
}

.page-header p {
  font-size: 14px;
  color: #777a73;
}

/* 分类区域 */
.category-section {
  margin-bottom: 32px;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  padding-bottom: 18px;
  border-bottom: 1px solid #e2e0d9;
}

/* 分类 Tab */
.category-tabs {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 9px 20px;
  border: 1px solid #dddcd5;
  border-radius: 20px;
  background: #f8f7f2;
  color: #666863;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  border-color: #587160;
  color: #587160;
}

.category-btn.active {
  background: #587160;
  border-color: #587160;
  color: #ffffff;
}

.search-box {
  width: 300px;
  height: 40px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background: #f8f7f2;
  border: 1px solid #dddcd5;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.2s;
}

.search-box:focus-within {
  border-color: #587160;
}

.search-input-wrap {
  position: relative;
  flex: 1;
  height: 100%;
}

.search-box input {
  width: 100%;
  height: 100%;
  padding: 0 38px 0 14px;
  border: none;
  outline: none;
  background: transparent;
  color: #30312f;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #999b95;
}

/* 清除按钮 */
.clear-btn {
  position: absolute;
  top: 50%;
  right: 8px;
  width: 22px;
  height: 22px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  border: none;
  border-radius: 50%;
  background: #d8d7d1;
  color: #ffffff;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
}

.clear-btn:hover {
  background: #aaa9a3;
  transform: translateY(-50%) scale(1.08);
}

/* 搜索按钮 */
.search-btn {
  height: 100%;
  padding: 0 18px;
  border: none;
  background: #587160;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover {
  background: #486052;
}

/* 商品结果 */
.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.result-header h2 {
  font-size: 20px;
  color: #30312f;
}

.result-header span {
  font-size: 13px;
  color: #888b84;
}

/* 商品列表 */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f8f7f2;
  border: 1px solid #e4e2db;
  border-radius: 16px;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow:
    0 10px 30px rgba(80, 90, 80, 0.08);
}

.product-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: #eeece6;
  font-size: 32px;
}

.product-content {
  flex: 1;
}

.product-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.product-top h3 {
  font-size: 17px;
  color: #30312f;
}

.rating {
  flex-shrink: 0;
  font-size: 12px;
  color: #777a73;
}

.category-name {
  margin-bottom: 10px;
  font-size: 13px;
  color: #587160;
}

.description {
  min-height: 42px;
  margin-bottom: 18px;
  font-size: 13px;
  line-height: 1.7;
  color: #777a73;
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #587160;
}

.sales {
  font-size: 12px;
  color: #999b95;
}

/* 无结果 */
.empty-result {
  padding: 80px 20px;
  text-align: center;
  background: #f8f7f2;
  border: 1px solid #e4e2db;
  border-radius: 16px;
}

.empty-icon {
  margin-bottom: 18px;
  font-size: 42px;
}

.empty-result h3 {
  margin-bottom: 8px;
  font-size: 18px;
  color: #30312f;
}

.empty-result p {
  margin-bottom: 22px;
  font-size: 14px;
  color: #888b84;
}

.empty-result button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: #587160;
  color: #ffffff;
  cursor: pointer;
}

/* 推荐 */
.recommend-section {
  margin-top: 32px;
}

.recommend-header {
  margin-bottom: 18px;
}

.recommend-header h2 {
  margin-bottom: 6px;
  color: #30312f;
  font-size: 20px;
}

.recommend-header p {
  color: #888b84;
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 900px) {
  .category-header {
    align-items: stretch;
    flex-direction: column;
  }

  .search-box {
    width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main {
    padding: 30px 24px;
  }
}

@media (max-width: 600px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .main {
    padding: 24px 16px;
  }
}
</style>
