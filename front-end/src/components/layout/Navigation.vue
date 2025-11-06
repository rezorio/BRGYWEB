<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/dashboard" class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-building text-white text-sm"></i>
            </div>
            <span class="text-xl font-semibold text-gray-900">BRGY Portal</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link
            to="/dashboard"
            :class="navLinkClass('dashboard')"
            class="nav-link"
          >
            <i class="fas fa-home mr-2"></i>
            Dashboard
          </router-link>
          <router-link
            to="/profile"
            :class="navLinkClass('profile')"
            class="nav-link"
          >
            <i class="fas fa-user mr-2"></i>
            Profile
          </router-link>
          <router-link
            v-if="authStore.isAdmin"
            to="/admin"
            :class="navLinkClass('admin')"
            class="nav-link"
          >
            <i class="fas fa-shield-alt mr-2"></i>
            Admin
          </router-link>
        </div>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 p-2 hover:bg-gray-100"
            >
              <div
                class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-user text-blue-600"></i>
              </div>
              <span class="hidden md:block font-medium text-gray-700">
                {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
              </span>
              <i class="fas fa-chevron-down text-gray-400 text-xs"></i>
            </button>

            <!-- Dropdown Menu -->
            <transition name="fade">
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">
                    {{ authStore.user?.firstName }}
                    {{ authStore.user?.lastName }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ authStore.user?.email }}
                  </p>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1"
                  >
                    {{ authStore.userRole }}
                  </span>
                  <!-- Session Status -->
                  <div class="mt-2 flex items-center justify-between">
                    <span class="text-xs text-gray-600">Session:</span>
                    <div class="flex items-center space-x-1">
                      <div
                        class="w-2 h-2 rounded-full"
                        :class="sessionStatusClass"
                      ></div>
                      <span class="text-xs" :class="sessionStatusTextClass">
                        {{ sessionStatusText }}
                      </span>
                    </div>
                  </div>
                  <div v-if="authStore.sessionTimeRemaining > 0" class="mt-1">
                    <div class="text-xs text-gray-600">
                      Time remaining:
                      {{ formatSessionTime(authStore.sessionTimeRemaining) }}
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        class="bg-blue-600 h-1 rounded-full transition-all duration-1000"
                        :style="{ width: sessionProgressPercentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
                <router-link
                  to="/profile"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  @click="showUserMenu = false"
                >
                  <i class="fas fa-user-circle mr-2"></i>
                  Profile
                </router-link>
                <button
                  @click="handleExtendSession"
                  class="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-gray-100"
                >
                  <i class="fas fa-clock mr-2"></i>
                  Extend Session
                </button>
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            </transition>
          </div>

          <!-- Mobile menu button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <transition name="fade">
        <div
          v-if="showMobileMenu"
          class="md:hidden border-t border-gray-200 py-2"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link
              to="/dashboard"
              :class="navLinkClass('dashboard')"
              class="block px-3 py-2 rounded-md text-base font-medium"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-home mr-2"></i>
              Dashboard
            </router-link>
            <router-link
              to="/profile"
              :class="navLinkClass('profile')"
              class="block px-3 py-2 rounded-md text-base font-medium"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-user mr-2"></i>
              Profile
            </router-link>
            <router-link
              v-if="authStore.isAdmin"
              to="/admin"
              :class="navLinkClass('admin')"
              class="block px-3 py-2 rounded-md text-base font-medium"
              @click="showMobileMenu = false"
            >
              <i class="fas fa-shield-alt mr-2"></i>
              Admin
            </router-link>
          </div>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();

const showUserMenu = ref(false);
const showMobileMenu = ref(false);

// Session management computed properties
const sessionStatusClass = computed(() => {
  const remaining = authStore.sessionTimeRemaining;
  if (remaining <= 5 * 60 * 1000) return "bg-red-500"; // Less than 5 minutes
  if (remaining <= 10 * 60 * 1000) return "bg-yellow-500"; // Less than 10 minutes
  return "bg-green-500"; // More than 10 minutes
});

const sessionStatusText = computed(() => {
  const remaining = authStore.sessionTimeRemaining;
  if (remaining <= 5 * 60 * 1000) return "Expiring Soon";
  if (remaining <= 10 * 60 * 1000) return "Warning";
  return "Active";
});

const sessionStatusTextClass = computed(() => {
  const remaining = authStore.sessionTimeRemaining;
  if (remaining <= 5 * 60 * 1000) return "text-red-600";
  if (remaining <= 10 * 60 * 1000) return "text-yellow-600";
  return "text-green-600";
});

const sessionProgressPercentage = computed(() => {
  const totalSessionTime = 30 * 60 * 1000; // 30 minutes
  const remaining = authStore.sessionTimeRemaining;
  return Math.max(0, Math.min(100, (remaining / totalSessionTime) * 100));
});

const formatSessionTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const navLinkClass = (routeName) => {
  return route.name === routeName ? "nav-link-active" : "";
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showMobileMenu.value = false;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
  showUserMenu.value = false;
};

const handleLogout = async () => {
  try {
    await authStore.logout();
    toastStore.showSuccess("Logged out successfully");
    router.push("/login");
  } catch {
    toastStore.showError("Logout failed");
  }
  showUserMenu.value = false;
};

const handleExtendSession = async () => {
  try {
    await authStore.extendSession();
    showUserMenu.value = false;
  } catch {
    // Error is handled by the auth store
  }
};

// Close dropdowns when clicking outside
document.addEventListener("click", (event) => {
  if (!event.target.closest(".relative")) {
    showUserMenu.value = false;
    showMobileMenu.value = false;
  }
});
</script>
