<template>


  <div class="app">
    <Navbar />

    <main>
      <!-- Banner 轮播 -->
      <section class="banner-section">
        <div class="banner">
          <div v-for="(item, index) in banners" :key="index" class="banner-item"
            :class="{ active: currentBanner === index }" @click="handleBannerClick">
            <div class="banner-content">
              <span class="banner-tag">
                {{ item.tag }}
              </span>

              <h2>
                {{ item.title }}
              </h2>

              <p>
                {{ item.description }}
              </p>

              <button @click="handleBannerClick()">
                {{ item.button }}
              </button>
            </div>
          </div>

          <!-- 左右切换 -->
          <button class="banner-arrow banner-prev" @click="prevBanner">
            ‹
          </button>

          <button class="banner-arrow banner-next" @click="nextBanner">
            ›
          </button>

          <!-- 底部指示器 -->
          <div class="banner-dots">
            <button v-for="(_, index) in banners" :key="index" :class="{ active: currentBanner === index }"
              @click="goBanner(index)"></button>
          </div>
        </div>
      </section>
      <!-- 固定Banner
      <section class="hero">
        <div class="hero-content">
          <p class="hero-tag">LIFEHUB</p>

          <h1>发现城市里的美好生活</h1>

          <p class="hero-desc">
            吃喝玩乐，一站式发现身边的优质服务。
          </p>

          <button class="hero-button">立即探索</button>
        </div>
      </section> -->

      <!-- 分类 -->
      <section class="section">
        <div class="section-title">
          <h2>热门分类</h2>
        </div>

        <div class="category-list">
          <div v-for="category in homeCategories" :key="category.id" class="category-item"
            @click="goCategory(category.id)">
            {{ category.icon }} {{ category.name }}
          </div>
        </div>
      </section>

      <!-- 推荐服务 -->
      <section class="section recommend-section">
        <div class="section-title">
          <h2>热门推荐</h2>
          <span>更多 →</span>
        </div>

        <div class="service-list">
          <div v-for="item in hotProducts" :key="item.id" class="service-card"
            @click="$router.push(`/detail/${item.id}`)">
            <div class="service-image">
              {{ item.icon }}
            </div>

            <div class="service-content">
              <h3>{{ item.name }}</h3>

              <p class="service-description">
                {{ item.description }}
              </p>

              <div class="service-bottom">
                <span class="price">
                  ¥{{ item.price }}
                </span>

                <span class="rating">
                  ⭐ {{ item.rating }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import { products } from "../../shared/data/products";
import {
  computed,
  onMounted,
  onUnmounted,
  ref
} from "vue";

import { useRouter } from "vue-router";

import { categories } from "../../shared/data/categories";

const router = useRouter();

const homeCategories = computed(() => {
  return categories.filter(
    (category) => category.id !== 1
  );
});

const hotProducts = computed(() => {
  return [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4);
});

const goCategory = (
  categoryId: number
) => {
  router.push({
    path: "/category",
    query: {
      category: String(categoryId)
    }
  });
};

// const goDetail = (id:number) => {
//   router.push(`/detail/${id}`);
// };

const handleBannerClick = () => {
  router.push("/category");
};


const banners = [
  {
    tag: "LIFEHUB · 城市生活",
    title: "发现城市里的美好生活",
    description: "美食、酒店、娱乐、购物，一站式发现身边好去处",
    button: "立即探索",
    path: "/category"
  },
  {
    tag: "LIFEHUB · 精选推荐",
    title: "精选热门好去处",
    description: "为你挑选本地热门生活服务，轻松找到心仪选择",
    button: "查看推荐",
    path: "/category"
  },
  {
    tag: "LIFEHUB · 美好生活",
    title: "让生活简单一点",
    description: "从今天开始，发现更多属于你的城市生活方式",
    button: "开始体验",
    path: "/category"
  }
];

const currentBanner = ref(0);

let bannerTimer: ReturnType<typeof setInterval> | null = null;

const nextBanner = () => {
  currentBanner.value =
    (currentBanner.value + 1) % banners.length;
};

const prevBanner = () => {
  currentBanner.value =
    (currentBanner.value - 1 + banners.length) %
    banners.length;
};

const goBanner = (index: number) => {
  currentBanner.value = index;
};

const startBanner = () => {
  bannerTimer = setInterval(() => {
    nextBanner();
  }, 5000);
};

const stopBanner = () => {
  if (bannerTimer) {
    clearInterval(bannerTimer);
    bannerTimer = null;
  }
};

// const handleBannerClick = (banner: typeof banners[number]) => {
//   router.push(banner.path);
// };

onMounted(() => {
  startBanner();
});

onUnmounted(() => {
  stopBanner();
});
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}


/* 搜索框 */
.search {
  display: flex;
  flex: 1;
  max-width: 500px;
}

.search input {
  flex: 1;
  height: 42px;
  padding: 0 16px;
  border: 1px solid #dddddd;
  border-right: none;
  border-radius: 8px 0 0 8px;
  outline: none;
  font-size: 14px;
}

.search button {
  width: 76px;
  border: none;
  border-radius: 0 8px 8px 0;
  background: #26382b;
  color: white;
  cursor: pointer;
}



/* Banner
.hero {
  min-height: 500px;
  display: flex;
  align-items: center;
  padding: 60px 8%;
  background: var(--primary-light);
}

.hero-content {
  max-width: 600px;
}

.hero-tag {
  margin-bottom: 16px;
  font-size: 14px;
  letter-spacing: 3px;
  color: #6d7d68;
}

.hero h1 {
  margin: 0 0 20px;
  font-size: 52px;
  line-height: 1.2;
}

.hero-desc {
  margin-bottom: 32px;
  color: #666;
  font-size: 18px;
}

.hero-button {
  padding: 14px 28px;
  border: none;
  border-radius: 8px;
  background: #26382b;
  color: white;
  font-size: 16px;
  cursor: pointer;
} */

/* 通用区域 */
.section {
  padding: 70px 8%;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
}

.section-title h2 {
  margin: 0;
  font-size: 32px;
}

.section-title span {
  color: #777;
  cursor: pointer;
}

/* 分类 */
.category-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.category-item {
  padding: 40px 20px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
  font-size: 18px;
  cursor: pointer;
  transition: 0.2s;
}

.category-item:hover {
  transform: translateY(-4px);
}

/* 推荐 */
.recommend-section {
  padding-top: 0;
}

.service-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.service-card {
  overflow: hidden;
  background: #fff;
  border-radius: 14px;
  transition: 0.2s;
}

.service-card:hover {
  transform: translateY(-4px);
}

.service-image {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef0eb;
  font-size: 60px;
}

.service-content {
  padding: 20px;
}

.service-content h3 {
  margin: 0 0 10px;
  font-size: 18px;
}

.service-description {
  margin: 0 0 20px;
  color: #777;
  font-size: 14px;
  line-height: 1.6;
}

.service-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.price {
  font-size: 20px;
  font-weight: 700;
}

.rating {
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .header {
    padding: 0 20px;
  }

  .nav {
    gap: 14px;
  }

  .nav a {
    font-size: 13px;
  }

  .hero {
    min-height: 420px;
    padding: 40px 20px;
  }

  .hero h1 {
    font-size: 36px;
  }

  .hero-desc {
    font-size: 16px;
  }

  .section {
    padding: 45px 20px;
  }

  .section-title h2 {
    font-size: 26px;
  }

  .category-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .service-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .service-image {
    height: 200px;
  }
}

/* banner轮播 */
.banner-section {
  margin-bottom: 48px;
}

.banner {
  position: relative;
  margin: 0 auto;

  width: 90%;
  height: 450px;


  overflow: hidden;

  border-radius: 20px;

  background: #dfe6df;
}

.banner-item {
  position: absolute;

  inset: 0;

  padding: 50px 60px;

  display: flex;
  align-items: center;

  opacity: 0;

  transform: translateX(30px);

  transition:
    opacity 0.6s ease,
    transform 0.6s ease;

  pointer-events: none;
}

.banner-item.active {
  opacity: 1;

  transform: translateX(0);

  pointer-events: auto;

  cursor: pointer;
}

.banner-item:nth-child(1) {
  background:
    linear-gradient(135deg,
      #dce7df 0%,
      #eef2e9 100%);
}

.banner-item:nth-child(2) {
  background:
    linear-gradient(135deg,
      #e5e2d8 0%,
      #f2efe5 100%);
}

.banner-item:nth-child(3) {
  background:
    linear-gradient(135deg,
      #dde4e3 0%,
      #edf1ee 100%);
}

.banner-item.active {
  opacity: 1;

  transform: translateX(0);

  pointer-events: auto;
}

.banner-content {
  max-width: 600px;
}

.banner-tag {
  display: inline-block;

  margin-bottom: 14px;

  font-size: 13px;

  color: #587160;

  letter-spacing: 1px;
}

.banner-content h2 {
  margin-bottom: 14px;

  font-size: 34px;
  line-height: 1.3;

  color: #303a33;
}

.banner-content p {
  margin-bottom: 24px;

  font-size: 15px;
  line-height: 1.7;

  color: #687169;
}

.banner-content button {
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

.banner-content button:hover {
  background: #486052;

  transform: translateY(-1px);
}

/* 左右按钮 */
.banner-arrow {
  position: absolute;

  top: 50%;

  width: 40px;
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform: translateY(-50%);

  border: none;
  border-radius: 50%;

  background: rgba(255, 255, 255, 0.65);

  color: #587160;

  font-size: 28px;

  cursor: pointer;

  transition:
    background 0.2s,
    transform 0.2s;
}

.banner-arrow:hover {
  background: rgba(255, 255, 255, 0.9);

  transform: translateY(-50%) scale(1.05);
}

.banner-prev {
  left: 20px;
}

.banner-next {
  right: 20px;
}

/* 小圆点 */
.banner-dots {
  position: absolute;

  left: 50%;
  bottom: 18px;

  display: flex;
  gap: 8px;

  transform: translateX(-50%);
}

.banner-dots button {
  width: 8px;
  height: 8px;

  padding: 0;

  border: none;
  border-radius: 50%;

  background: rgba(88, 113, 96, 0.35);

  cursor: pointer;

  transition:
    width 0.2s,
    background 0.2s;
}

.banner-dots button.active {
  width: 22px;

  border-radius: 10px;

  background: #587160;
}

/* 响应式 */
@media (max-width: 900px) {
  .banner {
    height: 280px;
  }

  .banner-item {
    padding: 40px;
  }

  .banner-content h2 {
    font-size: 28px;
  }
}

@media (max-width: 600px) {
  .banner {
    height: 260px;
  }

  .banner-item {
    padding: 30px;
  }

  .banner-content h2 {
    font-size: 24px;
  }

  .banner-content p {
    font-size: 13px;
  }

  .banner-arrow {
    width: 34px;
    height: 34px;

    font-size: 22px;
  }
}
</style>