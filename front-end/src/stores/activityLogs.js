import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useActivityLogsStore = defineStore("activityLogs", () => {
  const logs = ref([]);
  const currentPage = ref(1);
  const logsPerPage = ref(5);

  // Load logs from localStorage on store initialization
  const loadLogs = () => {
    try {
      const savedLogs = localStorage.getItem("activityLogs");
      if (savedLogs) {
        const parsedLogs = JSON.parse(savedLogs);
        // Clean up logs older than 5 months
        const fiveMonthsAgo = new Date();
        fiveMonthsAgo.setMonth(fiveMonthsAgo.getMonth() - 5);

        logs.value = parsedLogs.filter((log) => {
          const logDate = new Date(log.timestamp);
          return logDate >= fiveMonthsAgo;
        });

        // Save cleaned logs back to localStorage
        saveLogs();
      }
    } catch (error) {
      console.error("Error loading activity logs:", error);
      logs.value = [];
    }
  };

  // Save logs to localStorage
  const saveLogs = () => {
    try {
      localStorage.setItem("activityLogs", JSON.stringify(logs.value));
    } catch (error) {
      console.error("Error saving activity logs:", error);
    }
  };

  // Add a new activity log
  const addLog = (title, description, type = "system", changes = null) => {
    const newLog = {
      id: Date.now() + Math.random(), // Ensure unique ID
      title,
      description,
      type,
      changes, // Store before/after changes
      timestamp: new Date().toISOString(),
      displayTimestamp: new Date().toLocaleString(),
      user: getCurrentUserInfo(),
    };

    logs.value.unshift(newLog);
    saveLogs();

    // Auto-cleanup old logs (keep only last 1000 logs for performance)
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(0, 1000);
      saveLogs();
    }
  };

  // Add a new activity log with user info provided directly
  const addLogWithUserInfo = (
    title,
    description,
    type = "system",
    changes = null,
    userInfo = null,
  ) => {
    const newLog = {
      id: Date.now() + Math.random(), // Ensure unique ID
      title,
      description,
      type,
      changes, // Store before/after changes
      timestamp: new Date().toISOString(),
      displayTimestamp: new Date().toLocaleString(),
      user: userInfo || getCurrentUserInfo(),
    };

    logs.value.unshift(newLog);
    saveLogs();

    // Auto-cleanup old logs (keep only last 1000 logs for performance)
    if (logs.value.length > 1000) {
      logs.value = logs.value.slice(0, 1000);
      saveLogs();
    }
  };

  // Get current user info for logging
  const getCurrentUserInfo = () => {
    try {
      // Try to get user info from current auth store in memory first
      const authStores = window.__pinia?.state?.value?.auth;
      console.log(authStores);
      if (authStores?.user) {
        return {
          email: authStores.user.email || "Unknown",
          name:
            `${authStores.user.firstName || ""} ${authStores.user.lastName || ""}`.trim() ||
            "Unknown User",
          role: authStores.user.roles?.[0] || "Unknown Role",
        };
      }

      // Fallback: try to get from localStorage tokens
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const payload = JSON.parse(atob(accessToken.split(".")[1]));
          return {
            email: payload.email || "Unknown",
            name: "Current User", // We don't have name in JWT payload
            role: payload.roles?.[0] || "Unknown Role",
          };
        } catch {
          // Token parsing failed
        }
      }

      // Last fallback
      return {
        email: "Unknown",
        name: "Unknown User",
        role: "Unknown Role",
      };
    } catch {
      return {
        email: "Unknown",
        name: "Unknown User",
        role: "Unknown Role",
      };
    }
  };

  // Computed properties for pagination
  const totalPages = computed(() => {
    return Math.ceil(logs.value.length / logsPerPage.value);
  });

  const paginatedLogs = computed(() => {
    const start = (currentPage.value - 1) * logsPerPage.value;
    const end = start + logsPerPage.value;
    return logs.value.slice(start, end);
  });

  // Pagination methods
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  // Filter logs by type
  const getLogsByType = (type) => {
    return logs.value.filter((log) => log.type === type);
  };

  // Search logs
  const searchLogs = (query) => {
    if (!query) return logs.value;

    const searchTerm = query.toLowerCase();
    return logs.value.filter(
      (log) =>
        log.title.toLowerCase().includes(searchTerm) ||
        log.description.toLowerCase().includes(searchTerm) ||
        log.user.name.toLowerCase().includes(searchTerm) ||
        log.user.email.toLowerCase().includes(searchTerm),
    );
  };

  // Clear all logs (admin function)
  const clearAllLogs = () => {
    logs.value = [];
    saveLogs();
    currentPage.value = 1;
  };

  // Initialize logs on store creation
  loadLogs();

  return {
    logs,
    currentPage,
    logsPerPage,
    totalPages,
    paginatedLogs,
    addLog,
    addLogWithUserInfo,
    nextPage,
    prevPage,
    goToPage,
    getLogsByType,
    searchLogs,
    clearAllLogs,
    loadLogs,
    saveLogs,
  };
});
