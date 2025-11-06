import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import { sessionManager } from "@/utils/sessionManager.js";

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref(null);
  const accessToken = ref(localStorage.getItem("accessToken"));
  const refreshToken = ref(localStorage.getItem("refreshToken"));
  const loading = ref(false);
  const error = ref(null);
  const sessionTimeout = ref(null);
  const lastActivity = ref(
    parseInt(localStorage.getItem("lastActivity")) || Date.now(),
  );
  const isRefreshing = ref(false);

  // Session configuration
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const WARNING_TIMEOUT = 25 * 60 * 1000; // 25 minutes
  const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes before expiry

  // Getters
  const isAuthenticated = computed(
    () => !!accessToken.value && !isSessionExpired(),
  );
  const userRole = computed(() => user.value?.roles?.[0] || null);
  const isAdmin = computed(() =>
    ["Admin", "Super Admin"].includes(userRole.value),
  );
  const isSuperAdmin = computed(() => userRole.value === "Super Admin");
  const sessionTimeRemaining = computed(() => {
    if (!lastActivity.value) return 0;
    const elapsed = Date.now() - lastActivity.value;
    return Math.max(0, SESSION_TIMEOUT - elapsed);
  });
  const shouldShowSessionWarning = computed(() => {
    return (
      sessionTimeRemaining.value > 0 &&
      sessionTimeRemaining.value <= SESSION_TIMEOUT - WARNING_TIMEOUT
    );
  });

  // Session management utilities
  const isSessionExpired = () => {
    if (!lastActivity.value) return true;
    return Date.now() - lastActivity.value > SESSION_TIMEOUT;
  };

  const updateLastActivity = () => {
    lastActivity.value = Date.now();
    localStorage.setItem("lastActivity", lastActivity.value.toString());
    resetSessionTimeout();
  };

  const resetSessionTimeout = () => {
    if (sessionTimeout.value) {
      clearTimeout(sessionTimeout.value);
    }

    sessionTimeout.value = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_TIMEOUT);
  };

  const handleSessionTimeout = () => {
    if (isAuthenticated.value) {
      // Import toast store dynamically to avoid circular dependency
      import("./toast.js").then(({ useToastStore }) => {
        useToastStore().showWarning(
          "Your session is about to expire due to inactivity.",
        );
      });
      // Give user 5 minutes warning before forced logout
      setTimeout(
        () => {
          if (isSessionExpired()) {
            import("./toast.js").then(({ useToastStore }) => {
              useToastStore().showError("Session expired. Please login again.");
            });
            clearAuth();
            window.location.href = "/login";
          }
        },
        5 * 60 * 1000,
      );
    }
  };

  const isTokenExpiringSoon = () => {
    if (!accessToken.value) return false;
    try {
      const payload = JSON.parse(atob(accessToken.value.split(".")[1]));
      const expiryTime = payload.exp * 1000;
      return Date.now() >= expiryTime - TOKEN_REFRESH_THRESHOLD;
    } catch {
      return true; // If we can't parse token, assume it's expiring
    }
  };

  // Initialize session on app load
  const initializeSession = async () => {
    if (accessToken.value && refreshToken.value) {
      try {
        // Check if session is expired
        if (isSessionExpired()) {
          clearAuth();
          return false;
        }

        // Check if token is expiring soon and refresh if needed
        if (isTokenExpiringSoon()) {
          await refreshTokens();
        }

        // Fetch fresh user data
        await fetchProfile();

        // Start session timeout
        resetSessionTimeout();

        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Session initialization failed:", error);
        clearAuth();
        return false;
      }
    }
    return false;
  };

  // Enhanced login with session management
  const login = async (credentials) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.post("/auth/login", credentials);
      const {
        accessToken: token,
        refreshToken: refresh,
        user: userData,
      } = response.data;

      // Store tokens with additional security
      accessToken.value = token;
      refreshToken.value = refresh;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);

      // Store user data
      user.value = userData;

      // Initialize session
      updateLastActivity();

      // Start session monitoring with session manager
      sessionManager.startMonitoring({
        isAuthenticated: true,
        updateLastActivity,
        sessionTimeRemaining: computed(() => sessionTimeRemaining.value),
      });

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Login failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const register = async (userData) => {
    try {
      loading.value = true;
      error.value = null;

      const response = await api.post("/auth/register", userData);
      const {
        accessToken: token,
        refreshToken: refresh,
        user: newUser,
      } = response.data;

      // Store tokens
      accessToken.value = token;
      refreshToken.value = refresh;
      localStorage.setItem("accessToken", token);
      localStorage.setItem("refreshToken", refresh);

      // Store user data
      user.value = newUser;

      // Initialize session
      updateLastActivity();
      sessionManager.startMonitoring({
        isAuthenticated: true,
        updateLastActivity,
        sessionTimeRemaining: computed(() => sessionTimeRemaining.value),
      });

      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Registration failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    try {
      if (accessToken.value) {
        await api.post("/auth/logout", { refreshToken: refreshToken.value });
      }
    } catch (err) {
      error.value = "Logout error: " + err.message;
    } finally {
      // Clear session data
      clearAuth();
      cleanupActivityMonitoring();
    }
  };

  const refreshTokens = async () => {
    // Prevent multiple refresh attempts
    if (isRefreshing.value) {
      return accessToken.value;
    }

    try {
      isRefreshing.value = true;

      if (!refreshToken.value) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/auth/refresh", {
        refreshToken: refreshToken.value,
      });

      const { accessToken: token } = response.data;
      accessToken.value = token;
      localStorage.setItem("accessToken", token);

      return token;
    } catch (err) {
      clearAuth();
      throw err;
    } finally {
      isRefreshing.value = false;
    }
  };

  const fetchProfile = async () => {
    try {
      loading.value = true;
      const response = await api.get("/auth/profile");
      user.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || "Failed to fetch profile";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Activity monitoring
  let activityEvents = [];

  const cleanupActivityMonitoring = () => {
    activityEvents.forEach(({ event, handler }) => {
      if (event === "storage") {
        window.removeEventListener(event, handler);
      } else {
        document.removeEventListener(event, handler);
      }
    });
    activityEvents = [];
  };

  const clearAuth = () => {
    user.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    lastActivity.value = null;

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("lastActivity");

    // Clear session timeout
    if (sessionTimeout.value) {
      clearTimeout(sessionTimeout.value);
      sessionTimeout.value = null;
    }

    // Cleanup activity monitoring
    sessionManager.stopMonitoring();
    cleanupActivityMonitoring();
  };

  const clearError = () => {
    error.value = null;
  };

  // Extend session manually
  const extendSession = async () => {
    if (isAuthenticated.value) {
      try {
        if (isTokenExpiringSoon()) {
          await refreshTokens();
        }
        updateLastActivity();
        import("./toast.js").then(({ useToastStore }) => {
          useToastStore().showSuccess("Session extended successfully.");
        });
      } catch {
        import("./toast.js").then(({ useToastStore }) => {
          useToastStore().showError(
            "Failed to extend session. Please login again.",
          );
        });
        clearAuth();
      }
    }
  };

  return {
    // State
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    lastActivity,
    sessionTimeRemaining,
    shouldShowSessionWarning,

    // Getters
    isAuthenticated,
    userRole,
    isAdmin,
    isSuperAdmin,

    // Actions
    login,
    register,
    logout,
    refreshTokens,
    fetchProfile,
    clearAuth,
    clearError,
    initializeSession,
    extendSession,
    updateLastActivity,
  };
});
