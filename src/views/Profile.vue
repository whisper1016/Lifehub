<script setup lang="ts">
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";
import { useFavoritesStore } from "../stores/favorites";
import { useOrdersStore } from "../stores/orders";
import { useAuthStore } from "../stores/auth";

const router = useRouter();

const favoritesStore = useFavoritesStore();
const ordersStore = useOrdersStore();


const goOrders = () => {
  router.push("/orders");
};


const goFavorites = () => {
  router.push("/favorites");
};
const authStore = useAuthStore();

/**
 * 退出登录
 */

const handleLogout = () => {
  authStore.logout();

  router.push("/login");
};

</script>

<template>
  <div class="profile-page">
    <Navbar />

    <main class="main">
      <!-- 用户信息 -->
      <section class="profile-card">
        <div class="avatar">
          👨‍💻
        </div>

        <div class="user-info">
          <h1>你好，{{ authStore.user?.username || "开发者" }}</h1>
          <p>欢迎来到 LifeHub</p>
        </div>

        <button class="edit-button">
          编辑资料
        </button>
      </section>

      <!-- 数据 -->
      <section class="stats">

        <div class="stat-item">
          <strong>
            {{ ordersStore.orders.length }}
          </strong>
          <span>
            我的订单
          </span>
        </div>


        <div class="stat-item">
          <strong>
            {{ favoritesStore.count }}
          </strong>
          <span>
            我的收藏
          </span>
        </div>


        <div class="stat-item">
          <strong>
            3
          </strong>
          <span>
            优惠券
          </span>
        </div>


        <div class="stat-item">
          <strong>
            8
          </strong>
          <span>
            浏览记录
          </span>
        </div>

      </section>

      <!-- 功能 -->
      <section class="menu-section">
        <h2>我的服务</h2>

        <div class="menu-list">
          <div class="menu-item" @click="goOrders">
            <div class="menu-left">
              <span class="menu-icon">📦</span>

              <div>
                <h3>我的订单</h3>
                <p>查看全部订单</p>
              </div>
            </div>

            <span class="arrow">→</span>
          </div>

          <div class="menu-item" @click="goFavorites">
            <div class="menu-left">
              <span class="menu-icon">❤️</span>

              <div>
                <h3>我的收藏</h3>
                <p>查看收藏的商品和服务</p>
              </div>
            </div>

            <span class="arrow">→</span>
          </div>

          <div class="menu-item">
            <div class="menu-left">
              <span class="menu-icon">🎟️</span>

              <div>
                <h3>优惠券</h3>
                <p>查看可使用的优惠券</p>
              </div>
            </div>

            <span class="arrow">→</span>
          </div>

          <div class="menu-item">
            <div class="menu-left">
              <span class="menu-icon">⚙️</span>

              <div>
                <h3>账号设置</h3>
                <p>管理账号和个人信息</p>
              </div>
            </div>

            <span class="arrow">→</span>
          </div>
        </div>
      </section>

      <!-- 退出 -->
      <button class="logout" @click="handleLogout">
        退出登录
      </button>
    </main>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f6f7f4;
  color: #222;
}

.main {
  width: 84%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 0 80px;
}

/* 用户信息 */
.profile-card {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 30px;
  background: #fff;
  border-radius: 16px;
}

.avatar {
  width: 84px;
  height: 84px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background: #eef0eb;

  font-size: 40px;
}

.user-info {
  flex: 1;
}

.user-info h1 {
  margin: 0 0 8px;
  font-size: 26px;
}

.user-info p {
  margin: 0;
  color: #888;
}

.edit-button {
  padding: 10px 20px;

  border: 1px solid #ddd;
  border-radius: 8px;

  background: #fff;
  color: #555;

  cursor: pointer;
}

/* 数据 */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;

  margin-top: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  padding: 25px;
  background: #fff;
  border-radius: 12px;
}

.stat-item strong {
  font-size: 26px;
}

.stat-item span {
  color: #777;
  font-size: 14px;
}

/* 服务 */
.menu-section {
  margin-top: 35px;
}

.menu-section h2 {
  margin-bottom: 18px;
  font-size: 24px;
}

.menu-list {
  overflow: hidden;
  background: #fff;
  border-radius: 14px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 22px 25px;

  border-bottom: 1px solid #eee;

  cursor: pointer;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:hover {
  background: #fafaf8;
}

.menu-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-icon {
  width: 46px;
  height: 46px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 10px;
  background: #eef0eb;

  font-size: 22px;
}

.menu-item h3 {
  margin: 0 0 5px;
  font-size: 16px;
}

.menu-item p {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.arrow {
  color: #999;
  font-size: 20px;
}

.logout {
  width: 100%;
  margin-top: 25px;
  padding: 14px;

  border: 1px solid #ddd;
  border-radius: 10px;

  background: #fff;
  color: #666;

  font-size: 15px;
  cursor: pointer;
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
</style>