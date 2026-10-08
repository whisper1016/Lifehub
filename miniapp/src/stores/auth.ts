import { reactive, computed } from "vue";

export interface User {
  username: string;
}

const STORAGE_KEY = "lifehub-user";

const state = reactive<{
  user: User | null;
}>({
  user: null,
});

/**
 * 从本地缓存读取用户
 */
const loadUser = () => {
  const savedUser = uni.getStorageSync(STORAGE_KEY);

  if (!savedUser) return;

  if (
    typeof savedUser === "object" &&
    savedUser.username
  ) {
    state.user = savedUser;
  }
};

/**
 * 保存用户
 */
const saveUser = () => {
  if (state.user) {
    uni.setStorageSync(
      STORAGE_KEY,
      state.user,
    );
  } else {
    uni.removeStorageSync(STORAGE_KEY);
  }
};

loadUser();

export const authStore = {
  /**
   * 当前用户
   */
  user: computed(() => state.user),

  /**
   * 是否登录
   */
  isLoggedIn: computed(
    () => state.user !== null,
  ),

  /**
   * 登录
   */
  login(username: string, password: string) {
    if (
      username !== "admin" ||
      password !== "123456"
    ) {
      return false;
    }

    state.user = {
      username,
    };

    saveUser();

    return true;
  },

  /**
   * 退出登录
   */
  logout() {
    state.user = null;
    saveUser();
  },
};