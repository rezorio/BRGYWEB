<template>
  <!-- Access Denied for Citizens -->
  <div
    v-if="!canAccessUserManagement"
    class="min-h-screen bg-gray-50 flex items-center justify-center"
  >
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
      <div class="mb-4">
        <i class="fas fa-shield-alt text-red-500 text-6xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
      <p class="text-gray-600 mb-6">
        You do not have permission to access the admin panel. This area is
        restricted to administrators only.
      </p>
      <router-link to="/dashboard" class="btn-primary">
        <i class="fas fa-arrow-left mr-2"></i>
        Return to Dashboard
      </router-link>
    </div>
  </div>

  <!-- Admin Panel Content -->
  <div v-else class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage users, roles, and system settings
            </p>
            <div class="mt-2 flex items-center">
              <span class="text-xs text-gray-500 mr-2">Logged in as:</span>
              <span
                :class="getRoleBadgeClass(authStore.userRole)"
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              >
                {{ authStore.userRole }}
              </span>
            </div>
          </div>
          <router-link to="/dashboard" class="btn-outline">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Admin Navigation Tabs -->
    <div class="bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
              activeTab === tab.key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <i :class="tab.icon" class="mr-2"></i>
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Users Management Tab -->
      <div v-if="activeTab === 'users'" class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">User Management</h2>
            <div class="flex space-x-2">
              <button
                @click="fetchUsers"
                :disabled="loading"
                class="btn-outline text-sm"
              >
                <i
                  :class="
                    loading ? 'fas fa-spinner fa-spin' : 'fas fa-sync-alt'
                  "
                  class="mr-2"
                ></i>
                Refresh
              </button>
              <button
                @click="showAddUserModal = true"
                class="btn-primary text-sm"
              >
                <i class="fas fa-user-plus mr-2"></i>
                Add User
              </button>
            </div>
          </div>

          <!-- Search and Filter -->
          <div class="flex flex-col sm:flex-row gap-4 mb-6">
            <div class="flex-1">
              <div class="relative">
                <input
                  v-model="userSearch"
                  type="text"
                  placeholder="Search users..."
                  class="form-input pl-10 pr-4"
                />
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <i class="fas fa-search text-gray-400 text-sm"></i>
                </div>
              </div>
            </div>
            <select v-model="roleFilter" class="form-input sm:w-48">
              <option value="">All Roles</option>
              <option value="Citizen">Citizen</option>
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <div v-if="loading" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-gray-400"></i>
              <p class="mt-2 text-sm text-gray-600">Loading users...</p>
            </div>
            <table v-else class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Joined
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <div
                          class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <i class="fas fa-user text-gray-500"></i>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ user.firstName }} {{ user.lastName }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ user.email }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="getRoleBadgeClass(user.role)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <i
                        :class="
                          user.status === 'Active'
                            ? 'fas fa-check'
                            : 'fas fa-times'
                        "
                        class="mr-1"
                      ></i>
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ user.joinedDate }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      v-if="canEditSpecificUser(user)"
                      @click="editUser(user)"
                      class="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit User"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      v-if="canDeleteUsers"
                      @click="deleteUser(user)"
                      class="text-red-600 hover:text-red-900"
                      title="Delete User (Super Admin Only)"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                    <span
                      v-if="!canEditSpecificUser(user) && !canDeleteUsers"
                      class="text-gray-400 text-sm"
                      title="Insufficient permissions for this user"
                    >
                      No permissions
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- System Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-6">
            System Settings
          </h2>
          <div class="space-y-6">
            <!-- Registration Settings -->
            <div>
              <h3 class="text-md font-medium text-gray-900 mb-4">
                Registration Settings
              </h3>
              <div class="space-y-4">
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="settings.allowRegistration"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >Allow new user registration</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="settings.requireEmailVerification"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >Require email verification</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="settings.autoApproveUsers"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >Auto-approve new users</span
                  >
                </label>
              </div>
            </div>

            <!-- Security Settings -->
            <div>
              <h3 class="text-md font-medium text-gray-900 mb-4">
                Security Settings
              </h3>
              <div class="space-y-4">
                <div>
                  <label class="form-label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    v-model="settings.sessionTimeout"
                    class="form-input max-w-xs"
                  />
                </div>
                <label class="flex items-center">
                  <input
                    type="checkbox"
                    v-model="settings.requireTwoFactor"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm text-gray-700"
                    >Require two-factor authentication</span
                  >
                </label>
              </div>
            </div>

            <div class="pt-4">
              <button @click="saveSettings" class="btn-primary">
                <i class="fas fa-save mr-2"></i>
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Activity Logs Tab -->
      <div v-if="activeTab === 'logs'" class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900">Activity Logs</h2>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-gray-500">
                Total: {{ activityLogsStore.totalLogs }} logs
              </span>
              <button
                @click="activityLogsStore.clearAllLogs()"
                class="btn-outline text-sm"
                title="Clear all logs (Admin only)"
              >
                <i class="fas fa-trash mr-2"></i>
                Clear All
              </button>
            </div>
          </div>

          <!-- Logs List -->
          <div class="space-y-4 mb-6">
            <div
              v-for="log in activityLogs"
              :key="log.id"
              class="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex-shrink-0">
                <div :class="getLogIconClass(log.type)" class="rounded-lg p-2">
                  <i :class="getLogIcon(log.type)" class="text-sm"></i>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <h3 class="text-sm font-medium text-gray-900">
                    {{ log.title }}
                  </h3>
                  <span class="text-xs text-gray-500">
                    {{ log.displayTimestamp }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">
                  {{ log.description }}
                </p>

                <!-- Show detailed changes if available -->
                <div
                  v-if="log.changes && Object.keys(log.changes).length > 0"
                  class="mt-2"
                >
                  <div class="bg-blue-50 border border-blue-200 rounded p-2">
                    <p class="text-xs font-medium text-blue-800 mb-1">
                      Changes Made:
                    </p>
                    <div class="space-y-1">
                      <div
                        v-for="[field, change] in Object.entries(log.changes)"
                        :key="field"
                        class="text-xs text-blue-700"
                      >
                        <span class="font-medium"
                          >{{ getFieldDisplayName(field) }}:</span
                        >
                        <span class="text-red-600">"{{ change.from }}"</span>
                        →
                        <span class="text-green-600">"{{ change.to }}"</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center mt-2 text-xs text-gray-500">
                  <i class="fas fa-user mr-1"></i>
                  <span>{{ log.userName }} ({{ log.userEmail }})</span>
                  <span class="mx-2">•</span>
                  <span class="capitalize">{{ log.userRole }}</span>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="activityLogs.length === 0" class="text-center py-8">
              <i class="fas fa-list-alt text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500">No activity logs found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="flex items-center justify-between border-t pt-4"
          >
            <div class="text-sm text-gray-500">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="activityLogsStore.prevPage()"
                :disabled="currentPage === 1"
                class="btn-outline text-sm"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <i class="fas fa-chevron-left mr-1"></i>
                Previous
              </button>

              <!-- Page numbers -->
              <div class="flex items-center space-x-1">
                <button
                  v-for="page in getVisiblePages()"
                  :key="page"
                  @click="activityLogsStore.goToPage(page)"
                  class="px-3 py-1 text-sm rounded"
                  :class="
                    page === currentPage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  "
                >
                  {{ page }}
                </button>
              </div>

              <button
                @click="activityLogsStore.nextPage()"
                :disabled="currentPage === totalPages"
                class="btn-outline text-sm"
                :class="{
                  'opacity-50 cursor-not-allowed': currentPage === totalPages,
                }"
              >
                Next
                <i class="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit User Modal -->
  <EditUserModal
    :is-visible="showEditUserModal"
    :user="selectedUser"
    @close="closeEditModal"
    @user-updated="handleUserUpdated"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { useToastStore } from "@/stores/toast";
import { useAuthStore } from "@/stores/auth";
import { useActivityLogsStore } from "@/stores/activityLogs";
import api from "@/services/api";
import EditUserModal from "@/components/admin/EditUserModal.vue";

const toastStore = useToastStore();
const authStore = useAuthStore();
const activityLogsStore = useActivityLogsStore();

const activeTab = ref("users");
const userSearch = ref("");
const roleFilter = ref("");
const showAddUserModal = ref(false);
const showEditUserModal = ref(false);
const selectedUser = ref(null);
const loading = ref(false);

// Role-based permissions
const canDeleteUsers = computed(() => {
  const userRole = authStore.userRole;
  return userRole === "Super Admin";
});

const canAccessUserManagement = computed(() => {
  const userRole = authStore.userRole;
  return userRole === "Admin" || userRole === "Super Admin";
});

// Check if current user can edit a specific user based on role hierarchy
const canEditSpecificUser = (targetUser) => {
  const currentUserRole = authStore.userRole;
  const targetUserRole = targetUser.role;

  // Super Admin can edit anyone
  if (currentUserRole === "Super Admin") {
    return true;
  }

  // Admin can only edit Citizens
  if (currentUserRole === "Admin") {
    return targetUserRole === "Citizen";
  }

  // Citizens cannot edit anyone
  return false;
};

const tabs = [
  { key: "users", label: "Users", icon: "fas fa-users" },
  { key: "settings", label: "Settings", icon: "fas fa-cog" },
  { key: "logs", label: "Activity Logs", icon: "fas fa-list-alt" },
];

// Real users data from backend
const users = ref([]);

// Fetch users from backend
const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get("/users");
    users.value = response.data;
  } catch (error) {
    toastStore.showError("Failed to fetch users");
    // eslint-disable-next-line no-console
    console.error("Error fetching users:", error);
  } finally {
    loading.value = false;
  }
};

const settings = reactive({
  allowRegistration: true,
  requireEmailVerification: false,
  autoApproveUsers: true,
  sessionTimeout: 30,
  requireTwoFactor: false,
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch = `${user.firstName} ${user.lastName} ${user.email}`
      .toLowerCase()
      .includes(userSearch.value.toLowerCase());
    const matchesRole = !roleFilter.value || user.role === roleFilter.value;
    return matchesSearch && matchesRole;
  });
});

const getRoleBadgeClass = (role) => {
  const classes = {
    Citizen: "bg-blue-100 text-blue-800",
    Admin: "bg-green-100 text-green-800",
    "Super Admin": "bg-purple-100 text-purple-800",
  };
  return classes[role] || "bg-gray-100 text-gray-800";
};

const getLogIcon = (type) => {
  const icons = {
    user: "fas fa-user text-blue-600",
    security: "fas fa-shield-alt text-green-600",
    system: "fas fa-cog text-purple-600",
  };
  return icons[type] || "fas fa-info-circle text-gray-600";
};

const getLogIconClass = (type) => {
  const classes = {
    user: "bg-blue-100",
    security: "bg-green-100",
    system: "bg-purple-100",
  };
  return classes[type] || "bg-gray-100";
};

// Helper method for field display names
const getFieldDisplayName = (field) => {
  const fieldNames = {
    firstName: "First Name",
    lastName: "Last Name",
    role: "Role",
    status: "Status",
    email: "Email",
  };
  return fieldNames[field] || field;
};

// Helper method for pagination
const getVisiblePages = () => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Show smart pagination
    if (current <= 4) {
      // Show first 5 pages + ... + last page
      for (let i = 1; i <= 5; i++) pages.push(i);
      if (total > 6) pages.push("...", total);
    } else if (current >= total - 3) {
      // Show first page + ... + last 5 pages
      pages.push(1, "...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      // Show first + ... + current-1, current, current+1 + ... + last
      pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
  }

  return pages.filter(
    (page) => page !== "..." || pages.indexOf(page) === pages.lastIndexOf(page),
  );
};

// Activity logs data from store
const activityLogs = computed(() => activityLogsStore.paginatedLogs);
const currentPage = computed(() => activityLogsStore.currentPage);
const totalPages = computed(() => activityLogsStore.totalPages);

// Add activity log entry with change tracking
const addActivityLog = async (
  title,
  description,
  type = "system",
  changes = null,
) => {
  // Get current user info from auth store
  const currentUserInfo = {
    userId: authStore.user?.id || null,
    userEmail: authStore.user?.email || "Unknown",
    userName:
      `${authStore.user?.firstName || ""} ${authStore.user?.lastName || ""}`.trim() ||
      "Unknown User",
    userRole: authStore.userRole || "Unknown Role",
  };

  await activityLogsStore.addLogWithUserInfo(
    title,
    description,
    type,
    changes,
    currentUserInfo,
  );
};

const editUser = async (user) => {
  if (!canEditSpecificUser(user)) {
    toastStore.showError(
      `You do not have permission to edit ${user.role} users`,
    );
    return;
  }

  selectedUser.value = user;
  showEditUserModal.value = true;
};

const deleteUser = async (user) => {
  if (!canDeleteUsers.value) {
    toastStore.showError("You do not have permission to delete users");
    return;
  }

  if (
    !confirm(
      `Are you sure you want to delete ${user.firstName} ${user.lastName}? This action cannot be undone.`,
    )
  ) {
    return;
  }

  try {
    // In a real app, this would be an API call to delete the user
    // await api.delete(`/users/${user.id}`);

    // For now, just remove from local array and show success
    const index = users.value.findIndex((u) => u.id === user.id);
    if (index > -1) {
      users.value.splice(index, 1);
    }

    toastStore.showSuccess(
      `User ${user.firstName} ${user.lastName} deleted successfully`,
    );
    await addActivityLog(
      "User Deleted",
      `${authStore.user?.firstName || "Super Admin"} deleted user ${user.firstName} ${user.lastName}`,
      "user",
    );
  } catch (error) {
    toastStore.showError(`Failed to delete user: ${error.message}`);
  }
};

const saveSettings = () => {
  toastStore.showSuccess("Settings saved successfully!");
};

// Modal event handlers
const closeEditModal = () => {
  showEditUserModal.value = false;
  selectedUser.value = null;
};

const handleUserUpdated = async (updatedUser) => {
  // Find the original user to track changes
  const originalUser = users.value.find((u) => u.id === updatedUser.id);

  // Track what changed
  const changes = {};
  if (originalUser) {
    if (originalUser.firstName !== updatedUser.firstName) {
      changes.firstName = {
        from: originalUser.firstName,
        to: updatedUser.firstName,
      };
    }
    if (originalUser.lastName !== updatedUser.lastName) {
      changes.lastName = {
        from: originalUser.lastName,
        to: updatedUser.lastName,
      };
    }
    if (originalUser.role !== updatedUser.role) {
      changes.role = { from: originalUser.role, to: updatedUser.role };
    }
    if (originalUser.status !== updatedUser.status) {
      changes.status = { from: originalUser.status, to: updatedUser.status };
    }
  }

  // Update the user in the users array
  const index = users.value.findIndex((u) => u.id === updatedUser.id);
  if (index > -1) {
    users.value[index] = updatedUser;
  }

  // Create detailed description of changes
  let changeDescription = `${authStore.user?.firstName || "Admin"} updated profile for user ${updatedUser.firstName} ${updatedUser.lastName}`;

  if (Object.keys(changes).length > 0) {
    const changeDetails = Object.entries(changes)
      .map(([field, change]) => {
        const fieldName =
          field === "firstName"
            ? "First Name"
            : field === "lastName"
              ? "Last Name"
              : field === "role"
                ? "Role"
                : field === "status"
                  ? "Status"
                  : field;
        return `${fieldName}: "${change.from}" → "${change.to}"`;
      })
      .join(", ");

    changeDescription += `. Changes: ${changeDetails}`;
  }

  await addActivityLog(
    "User Profile Updated",
    changeDescription,
    "user",
    changes,
  );
};

onMounted(() => {
  fetchUsers();
  // Fetch activity logs if user is authenticated
  if (authStore.accessToken) {
    activityLogsStore.fetchLogs();
  }
});
</script>
