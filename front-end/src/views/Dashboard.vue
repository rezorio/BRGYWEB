<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p class="mt-1 text-sm text-gray-600">
              Welcome back, {{ authStore.user?.firstName }}!
            </p>
          </div>
          <div class="flex items-center space-x-3">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
            >
              <i class="fas fa-user-circle mr-1"></i>
              {{ authStore.userRole }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <i class="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Users</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.totalUsers }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <i class="fas fa-user-check text-green-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Active Users</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.activeUsers }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <i class="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Pending Requests</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.pendingRequests }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <i class="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Completion Rate</p>
              <p class="text-2xl font-bold text-gray-900">
                {{ stats.completionRate }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Quick Actions Card -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div class="space-y-3">
            <button
              @click="navigateToProfile"
              class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div class="flex items-center">
                <i class="fas fa-user-edit text-blue-600 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Edit Profile</p>
                  <p class="text-sm text-gray-600">
                    Update your personal information
                  </p>
                </div>
              </div>
            </button>

            <button
              v-if="authStore.isAdmin"
              @click="navigateToAdmin"
              class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div class="flex items-center">
                <i class="fas fa-shield-alt text-green-600 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Admin Panel</p>
                  <p class="text-sm text-gray-600">
                    Manage users and system settings
                  </p>
                </div>
              </div>
            </button>

            <button
              class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div class="flex items-center">
                <i class="fas fa-file-alt text-purple-600 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">View Documents</p>
                  <p class="text-sm text-gray-600">
                    Access your documents and files
                  </p>
                </div>
              </div>
            </button>

            <button
              class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
            >
              <div class="flex items-center">
                <i class="fas fa-bell text-yellow-600 mr-3"></i>
                <div>
                  <p class="font-medium text-gray-900">Notifications</p>
                  <p class="text-sm text-gray-600">View recent notifications</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div :class="activity.iconBg" class="rounded-lg p-2">
                  <i :class="activity.icon" class="text-sm"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ activity.title }}
                </p>
                <p class="text-sm text-gray-600">{{ activity.description }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Information -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">
          Your Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p class="text-sm font-medium text-gray-600">Full Name</p>
            <p class="text-sm text-gray-900">
              {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
            </p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Email Address</p>
            <p class="text-sm text-gray-900">{{ authStore.user?.email }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Role</p>
            <p class="text-sm text-gray-900">{{ authStore.userRole }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Account Status</p>
            <span
              class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
            >
              <i class="fas fa-check-circle mr-1"></i>
              Active
            </span>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Last Login</p>
            <p class="text-sm text-gray-900">{{ formatLastLogin() }}</p>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-600">Member Since</p>
            <p class="text-sm text-gray-900">{{ formatDate() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Mock data - in a real app, this would come from API
const stats = ref({
  totalUsers: 1247,
  activeUsers: 892,
  pendingRequests: 23,
  completionRate: 87,
});

const recentActivities = ref([
  {
    id: 1,
    title: "Profile Updated",
    description: "You updated your profile information",
    time: "2 hours ago",
    icon: "fas fa-user text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    id: 2,
    title: "Document Uploaded",
    description: "New document added to your files",
    time: "1 day ago",
    icon: "fas fa-file-upload text-green-600",
    iconBg: "bg-green-100",
  },
  {
    id: 3,
    title: "System Update",
    description: "New features have been added to the system",
    time: "3 days ago",
    icon: "fas fa-system text-purple-600",
    iconBg: "bg-purple-100",
  },
  {
    id: 4,
    title: "Login Alert",
    description: "New login detected from your account",
    time: "1 week ago",
    icon: "fas fa-sign-in-alt text-yellow-600",
    iconBg: "bg-yellow-100",
  },
]);

const navigateToProfile = () => {
  router.push("/profile");
};

const navigateToAdmin = () => {
  router.push("/admin");
};

const formatLastLogin = () => {
  return "Today at 9:30 AM";
};

const formatDate = () => {
  const date = new Date();
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  // Dashboard component mounted
});
</script>
