<template>
  <div class="favorites-page">
    <Navbar />

    <main class="main">
      <!-- 页面标题 -->
      <section class="page-header">
        <div>
          <h1>我的收藏</h1>
          <p>
            {{ favoriteProducts.length > 0
              ? `已收藏 ${favoriteProducts.length} 件商品`
              : "收藏你喜欢的城市生活好去处"
            }}
          </p>
        </div>
      </section>

      <!-- 有收藏 -->
      <section
        v-if="favoriteProducts.length > 0"
        class="favorites-section"
      >
        <div class="product-grid">
          <div
            v-for="item in favoriteProducts"
            :key="item.id"
            class="product-card"
            @click="goDetail(item.id)"
          >
            <div class="product-icon">
              {{ item.icon }}
            </div>

            <div class="product-content">
              <div class="product-top">
                <h3>
                  {{ item.name }}
                </h3>

                <button
                  class="favorite-btn"
                  @click.stop="
                    removeFavorite(item.id)
                  "
                >
                  ♥
                </button>
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
      </section>

      <!-- 空收藏 -->
      <section
        v-else
        class="empty-favorites"
      >
        <div class="empty-illustration">
          <div class="empty-heart">
            ♡
          </div>
        </div>

        <h2>
          还没有收藏内容
        </h2>

        <p>
          把喜欢的商品收藏起来，<br />
          以后可以快速找到它们
        </p>

        <button
          class="browse-btn"
          @click="goCategory"
        >
          去发现商品
        </button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/Navbar.vue";

import { products } from "../../shared/data/products";

import { useFavoritesStore } from "../stores/favorites";
// import { categories } from "../../shared/data/categories";
import { getCategoryName } from "../../shared/utils/category";

// const getCategoryName = (categoryId: number) => {
//   const category = categories.find(
//     (item) => item.id === categoryId
//   );

//   return category?.name || "未知分类";
// };

const router = useRouter();

const favoritesStore =
  useFavoritesStore();

const favoriteProducts = computed(() => {
  return products.filter((item) =>
    favoritesStore.favoriteIds.includes(
      item.id
    )
  );
});

/**
 * 进入商品详情
 */
const goDetail = (id: number) => {
  router.push(`/detail/${id}`);
};

/**
 * 取消收藏
 */
const removeFavorite = (
  id: number
) => {
  favoritesStore.toggle(id);
};

/**
 * 去分类页
 */
const goCategory = () => {
  router.push("/category");
};
</script>

<style scoped>
.favorites-page {
  min-height: 100vh;

  background: #f2f1ec;
}

.main {
  max-width: 1100px;

  margin: 0 auto;

  padding: 40px;
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin-bottom: 8px;

  color: #30312f;

  font-size: 30px;
}

.page-header p {
  color: #777a73;

  font-size: 14px;
}

/* 商品列表 */
.product-grid {
  display: grid;

  grid-template-columns:
    repeat(3, 1fr);

  gap: 20px;
}

.product-card {
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
    0 10px 30px
    rgba(80, 90, 80, 0.08);
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
  display: flex;

  flex-direction: column;
}

.product-top {
  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-bottom: 8px;
}

.product-top h3 {
  color: #30312f;

  font-size: 17px;
}

.favorite-btn {
  width: 32px;
  height: 32px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border: none;

  border-radius: 50%;

  background: #f0e4e1;

  color: #c46b61;

  font-size: 18px;

  cursor: pointer;

  transition:
    transform 0.2s,
    background 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.08);

  background: #ead8d4;
}

.category-name {
  margin-bottom: 10px;

  color: #587160;

  font-size: 13px;
}

.description {
  min-height: 42px;

  margin-bottom: 18px;

  color: #777a73;

  font-size: 13px;

  line-height: 1.7;
}

.product-bottom {
  display: flex;

  align-items: center;

  justify-content: space-between;
}

.price {
  color: #587160;

  font-size: 20px;

  font-weight: 700;
}

.sales {
  color: #999b95;

  font-size: 12px;
}

/* 空状态 */
.empty-favorites {
  min-height: 430px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  padding: 60px 20px;

  text-align: center;

  background: #f8f7f2;

  border: 1px solid #e4e2db;

  border-radius: 18px;
}

/* 空状态图标 */
.empty-illustration {
  width: 110px;
  height: 110px;

  margin-bottom: 24px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eeece6;
}

.empty-heart {
  color: #c4c4bc;

  font-size: 62px;

  line-height: 1;
}

/* 空状态文字 */
.empty-favorites h2 {
  margin-bottom: 10px;

  color: #3b3d39;

  font-size: 21px;

  font-weight: 600;
}

.empty-favorites p {
  margin-bottom: 26px;

  color: #8b8e87;

  font-size: 14px;

  line-height: 1.8;
}

/* 去发现 */
.browse-btn {
  padding: 11px 24px;

  border: none;

  border-radius: 9px;

  background: #587160;

  color: #ffffff;

  font-size: 14px;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;
}

.browse-btn:hover {
  background: #486052;

  transform: translateY(-1px);
}

/* 响应式 */
@media (max-width: 900px) {
  .product-grid {
    grid-template-columns:
      repeat(2, 1fr);
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

  .empty-favorites {
    min-height: 380px;
  }
}
</style>