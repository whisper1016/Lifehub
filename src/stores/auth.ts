import { defineStore } from "pinia";

interface User {
  username: string;
}

const getUser = (): User | null => {
  const data = localStorage.getItem("user");

  if (!data) {
    return null;
  }

  try {
    const user = JSON.parse(data);

    if (!user || typeof user.username !== "string") {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: getUser() as User | null
  }),

  getters: {
    isLoggedIn: (state) => {
      return state.user !== null;
    }
  },

  actions: {
    login(username: string, password: string) {
      if (!username || !password) {
        return false;
      }

      if (
        username !== "admin" ||
        password !== "123456"
      ) {
        return false;
      }

      this.user = {
        username
      };

      localStorage.setItem(
        "user",
        JSON.stringify(this.user)
      );

      return true;
    },

    logout() {
      this.user = null;
      localStorage.removeItem("user");
    }
  }
});