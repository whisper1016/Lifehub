<template>
  <div class="app-layout">

    <!-- 左侧导航 -->
    <AppSidebar />

    <!-- 右侧区域 -->
    <div class="app-main">

      <!-- 顶部 -->
      <AppHeader />

      <!-- 页面内容 -->
      <main class="app-content">
        <router-view />
      </main>

    </div>

  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
</script>