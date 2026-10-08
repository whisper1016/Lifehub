<template>
    <view class="page">
        <view class="login-card">
            <!-- Logo -->
            <view class="logo">
                <text>LH</text>
            </view>

            <text class="title">
                欢迎来到 LifeHub
            </text>

            <text class="subtitle">
                登录后享受完整的生活服务
            </text>

            <!-- 表单 -->
            <view class="form">
                <!-- 用户名 -->
                <view class="form-item">
                    <text class="label">
                        用户名
                    </text>

                    <input v-model="username" class="input" type="text" placeholder="请输入用户名"
                        placeholder-class="placeholder" />
                </view>

                <!-- 密码 -->
                <view class="form-item">
                    <text class="label">
                        密码
                    </text>

                    <input v-model="password" class="input" type="password" placeholder="请输入密码"
                        placeholder-class="placeholder" />
                </view>
            </view>

            <!-- 登录按钮 -->
            <button class="login-button" @click="login">
                登录
            </button>

            <!-- 演示账号 -->
            <view class="demo-account">
                <text class="demo-title">
                    演示账号
                </text>

                <text class="demo-text">
                    用户名：admin
                </text>

                <text class="demo-text">
                    密码：123456
                </text>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { authStore } from "../../stores/auth";
import { favoritesStore } from "../../stores/favorites";
import { ordersStore } from "../../stores/orders";


const username = ref("");
const password = ref("");

const login = () => {
    if (!username.value.trim()) {
        uni.showToast({
            title: "请输入用户名",
            icon: "none",
        });

        return;
    }

    if (!password.value) {
        uni.showToast({
            title: "请输入密码",
            icon: "none",
        });

        return;
    }

    const success = authStore.login(
        username.value.trim(),
        password.value,
    );

    if (!success) {
        uni.showToast({
            title: "用户名或密码错误",
            icon: "none",
        });

        return;
    }

    favoritesStore.reload();
    ordersStore.reload();

    uni.showToast({
        title: "登录成功",
        icon: "success",
    });

    setTimeout(() => {
        uni.switchTab({
            url: "/pages/profile/profile",
        });
    }, 500);
};
</script>

<style scoped>
.page {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 40rpx;
    box-sizing: border-box;
    background: #f5f6f2;
}

.login-card {
    width: 100%;
    padding: 50rpx 36rpx;
    box-sizing: border-box;
    background: #fbfcf9;
    border-radius: 28rpx;
}

/* Logo */

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110rpx;
    height: 110rpx;
    margin: 0 auto 30rpx;
    border-radius: 30rpx;
    background: #e8eee9;
}

.logo text {
    color: #587160;
    font-size: 38rpx;
    font-weight: 700;
}

/* 标题 */

.title {
    display: block;
    color: #303a33;
    font-size: 38rpx;
    font-weight: 700;
    text-align: center;
}

.subtitle {
    display: block;
    margin-top: 12rpx;
    color: #8a918b;
    font-size: 24rpx;
    text-align: center;
}

/* 表单 */

.form {
    margin-top: 50rpx;
}

.form-item {
    margin-bottom: 26rpx;
}

.label {
    display: block;
    margin-bottom: 12rpx;
    color: #303a33;
    font-size: 25rpx;
    font-weight: 600;
}

.input {
    width: 100%;
    height: 82rpx;
    padding: 0 24rpx;
    box-sizing: border-box;
    color: #303a33;
    font-size: 27rpx;
    background: #f1f3ef;
    border-radius: 16rpx;
}

.placeholder {
    color: #a0a69f;
}

/* 登录 */

.login-button {
    width: 100%;
    height: 86rpx;
    margin-top: 12rpx;
    padding: 0;
    line-height: 86rpx;
    color: #ffffff;
    font-size: 29rpx;
    background: #587160;
    border-radius: 18rpx;
}

.login-button::after {
    border: none;
}

/* 演示账号 */

.demo-account {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 36rpx;
    padding: 22rpx;
    background: #f1f3ef;
    border-radius: 16rpx;
}

.demo-title {
    margin-bottom: 8rpx;
    color: #6f7d72;
    font-size: 23rpx;
    font-weight: 600;
}

.demo-text {
    margin-top: 4rpx;
    color: #929993;
    font-size: 22rpx;
}
</style>