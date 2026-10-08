import { reactive, computed } from "vue";
import { authStore } from "./auth";

const getStorageKey = () => {
  const username = authStore.user.value?.username;

  if (!username) {
    return "";
  }

  return `lifehub-favorites-${username}`;
};

const state = reactive<{
  ids: number[];
}>({
  ids: [],
});

const loadFavorites = () => {
  state.ids.splice(0, state.ids.length);

  const key = getStorageKey();

  if (!key) {
    return;
  }

  const savedFavorites = uni.getStorageSync(key);

  if (!Array.isArray(savedFavorites)) {
    return;
  }

  state.ids.push(...savedFavorites);
};

const saveFavorites = () => {
  const key = getStorageKey();

  if (!key) {
    return;
  }

  uni.setStorageSync(key, state.ids);
};

loadFavorites();

export const favoritesStore = {
  ids: state.ids,

  count: computed(() => state.ids.length),

  isFavorite(id: number) {
    return state.ids.includes(id);
  },

  toggle(id: number) {
    if (!authStore.isLoggedIn.value) {
      uni.navigateTo({
        url: "/pages/login/login",
      });
      return;
    }

    const index = state.ids.indexOf(id);

    if (index !== -1) {
      state.ids.splice(index, 1);
    } else {
      state.ids.push(id);
    }

    saveFavorites();
  },

  reload() {
    loadFavorites();
  },
};