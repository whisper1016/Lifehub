<template>
    <div class="login-page">
        <Navbar />

        <main class="login-main">
            <section class="login-card">
                <!-- Logo / 标题 -->
                <div class="login-header">
                    <div class="logo">
                        LH
                    </div>

                    <h1>欢迎回来</h1>

                    <p>
                        登录 LifeHub，继续探索城市生活
                    </p>
                </div>

                <!-- 登录表单 -->
                <form class="login-form" @submit.prevent="handleLogin">
                    <!-- 账号 -->
                    <div class="form-item">
                        <label for="username">
                            账号
                        </label>

                        <input id="username" v-model="username" type="text" placeholder="请输入账号"
                            autocomplete="username" />
                    </div>

                    <!-- 密码 -->
                    <div class="form-item">
                        <label for="password">
                            密码
                        </label>

                        <input id="password" v-model="password" type="password" placeholder="请输入密码"
                            autocomplete="current-password" />
                    </div>

                    <!-- 错误信息 -->
                    <p v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </p>

                    <!-- 登录按钮 -->
                    <button type="submit" class="login-btn">
                        登录
                    </button>
                </form>

                <!-- Demo 提示 -->
                <div class="demo-tip">
                    <span>Demo 账号</span>

                    <p>
                        admin / 123456
                    </p>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

import Navbar from "../components/Navbar.vue";
import { useAuthStore } from "../stores/auth";



const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

const username = ref("");
const password = ref("");

const errorMessage = ref("");

/**
 * 登录
 */
const handleLogin = () => {
    errorMessage.value = "";

    if (!username.value.trim()) {
        errorMessage.value = "请输入账号";
        return;
    }

    if (!password.value) {
        errorMessage.value = "请输入密码";
        return;
    }

    const success = authStore.login(
        username.value.trim(),
        password.value
    );

    if (!success) {
        errorMessage.value = "账号或密码错误";
        return;
    }

    const redirect = route.query.redirect;

    if (typeof redirect === "string") {
        router.push(redirect);
    } else {
        router.push("/");
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: #f2f1ec;
}

.login-main {
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px 70px;
}

.login-card {
    width: 100%;
    max-width: 420px;
    padding: 40px;
    background: #f8f7f2;
    border: 1px solid #e4e2db;
    border-radius: 18px;
    box-shadow:
        0 10px 30px rgba(80, 90, 80, 0.05);
}

/* 头部 */

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.logo {
    width: 52px;
    height: 52px;
    margin: 0 auto 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 14px;
    background: #587160;

    color: #ffffff;
    font-size: 18px;
    font-weight: 700;
}

.login-header h1 {
    margin-bottom: 8px;

    color: #30312f;
    font-size: 24px;
}

.login-header p {
    color: #888b84;
    font-size: 13px;
}

/* 表单 */

.login-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-item label {
    color: #555a54;
    font-size: 13px;
}

.form-item input {
    width: 100%;
    height: 44px;
    padding: 0 13px;

    border: 1px solid #dddcd5;
    border-radius: 8px;

    outline: none;
    background: #f2f1ec;

    color: #30312f;
    font-size: 14px;

    transition:
        border-color 0.2s,
        background 0.2s;
}

.form-item input::placeholder {
    color: #aaaDA6;
}

.form-item input:focus {
    border-color: #7d9585;
    background: #f8f7f2;
}

/* 错误 */

.error-message {
    margin-top: -5px;

    color: #a25f54;
    font-size: 12px;
}

/* 登录按钮 */

.login-btn {
    width: 100%;
    height: 44px;

    margin-top: 2px;

    border: none;
    border-radius: 8px;

    background: #587160;
    color: #ffffff;

    font-size: 14px;
    cursor: pointer;

    transition:
        background 0.2s,
        transform 0.2s;
}

.login-btn:hover {
    background: #486052;
}

.login-btn:active {
    transform: translateY(1px);
}

/* Demo 提示 */

.demo-tip {
    margin-top: 24px;
    padding: 12px 14px;

    border-radius: 9px;
    background: #eeece6;

    text-align: center;
}

.demo-tip span {
    color: #777a73;
    font-size: 12px;
}

.demo-tip p {
    margin-top: 5px;

    color: #587160;
    font-size: 12px;
}
</style>