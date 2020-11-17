import Vue from "vue";
import vuex from "vuex";
import localStorage from "vuex-persistedstate";

Vue.use(vuex);

export default new vuex.Store({
  strict: true,
  plugins: [localStorage()],
  state: {
    admin: null,
    adminToken: null,
    isAdminLoggedIn: false,
    isSessionExpiredIn: false
  },
  mutations: {
    setAdmin(state, admin) {
      state.admin = admin;
    },
    setAdminToken(state, adminToken) {
      state.adminToken = adminToken;
      if (state.adminToken) state.isAdminLoggedIn = true;
      else state.isAdminLoggedIn = false;
    },
    setSession(state, isSessionExpiredIn) {
      state.isSessionExpiredIn = isSessionExpiredIn;
    }
  },

  actions: {
    setAdmin({ commit }, admin) {
      commit("setAdmin", admin);
    },
    setAdminToken({ commit }, adminToken) {
      commit("setAdminToken", adminToken);
    },
    setSession({ commit }, isSessionExpiredIn) {
      commit("setSession", isSessionExpiredIn);
    }
  }
});
