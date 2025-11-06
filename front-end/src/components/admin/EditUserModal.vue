<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <!-- Modal Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium text-gray-900">Edit User Profile</h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <form @submit.prevent="handleSubmit">
        <!-- First Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <input
            v-model="form.firstName"
            type="text"
            required
            class="form-input w-full"
            :class="{ 'border-red-500': errors.firstName }"
          />
          <p v-if="errors.firstName" class="form-error">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Last Name -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Last Name
          </label>
          <input
            v-model="form.lastName"
            type="text"
            required
            class="form-input w-full"
            :class="{ 'border-red-500': errors.lastName }"
          />
          <p v-if="errors.lastName" class="form-error">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email (Read-only) -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            v-model="form.email"
            type="email"
            readonly
            class="form-input w-full bg-gray-100 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">
            Email cannot be changed for security reasons
          </p>
        </div>

        <!-- Role Selection -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            User Role
          </label>
          <select
            v-model="form.role"
            class="form-input w-full"
            :class="{ 'border-red-500': errors.role }"
            :disabled="availableRoles.length === 0"
          >
            <option
              v-for="role in availableRoles"
              :key="role.value"
              :value="role.value"
            >
              {{ role.label }}
            </option>
          </select>
          <p
            v-if="availableRoles.length === 1"
            class="text-xs text-gray-500 mt-1"
          >
            As an Admin, you can only assign the Citizen role
          </p>
          <p
            v-if="availableRoles.length === 0"
            class="text-xs text-red-500 mt-1"
          >
            You do not have permission to change user roles
          </p>
          <p v-if="errors.role" class="form-error">
            {{ errors.role }}
          </p>
        </div>

        <!-- Status -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Account Status
          </label>
          <select v-model="form.status" class="form-input w-full">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <!-- Error Message -->
        <div
          v-if="submitError"
          class="mb-4 bg-red-50 border border-red-200 rounded-md p-3"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <i class="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div class="ml-3">
              <p class="text-sm text-red-800">{{ submitError }}</p>
            </div>
          </div>
        </div>

        <!-- Modal Actions -->
        <div class="flex items-center justify-end space-x-3">
          <button type="button" @click="closeModal" class="btn-outline">
            Cancel
          </button>
          <button type="submit" :disabled="loading" class="btn-primary">
            <i v-if="loading" class="fas fa-spinner fa-spin mr-2"></i>
            <i v-else class="fas fa-save mr-2"></i>
            {{ loading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from "vue";
import { useToastStore } from "@/stores/toast";
import { useAuthStore } from "@/stores/auth";
import api from "@/services/api";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["close", "userUpdated"]);

const toastStore = useToastStore();
const authStore = useAuthStore();
const loading = ref(false);
const submitError = ref("");

// Check what roles the current user can assign
const availableRoles = computed(() => {
  const currentUserRole = authStore.userRole;

  if (currentUserRole === "Super Admin") {
    // Super Admin can assign any role
    return [
      { value: "Citizen", label: "Citizen" },
      { value: "Admin", label: "Admin" },
      { value: "Super Admin", label: "Super Admin" },
    ];
  } else if (currentUserRole === "Admin") {
    // Admin can only assign Citizen role
    return [{ value: "Citizen", label: "Citizen" }];
  }

  return [];
});

const form = reactive({
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  status: "Active",
});

const errors = reactive({
  firstName: "",
  lastName: "",
  role: "",
});

// Watch for user prop changes to populate form
watch(
  () => props.user,
  (newUser) => {
    if (newUser) {
      form.firstName = newUser.firstName || "";
      form.lastName = newUser.lastName || "";
      form.email = newUser.email || "";
      form.role = newUser.role || "Citizen";
      form.status = newUser.status || "Active";
    }
  },
  { immediate: true },
);

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });

  // First Name validation
  if (!form.firstName.trim()) {
    errors.firstName = "First name is required";
    isValid = false;
  } else if (form.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
    isValid = false;
  }

  // Last Name validation
  if (!form.lastName.trim()) {
    errors.lastName = "Last name is required";
    isValid = false;
  } else if (form.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
    isValid = false;
  }

  // Role validation
  if (!form.role) {
    errors.role = "Please select a role";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  submitError.value = "";

  try {
    // Make API call to update the user
    const response = await api.put(`/users/${props.user.id}`, {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      role: form.role,
      status: form.status,
    });

    const updatedUser = response.data;
    toastStore.showSuccess(
      `User ${updatedUser.firstName} ${updatedUser.lastName} updated successfully`,
    );
    emit("userUpdated", updatedUser);
    closeModal();
  } catch (error) {
    submitError.value =
      error.response?.data?.message ||
      "Failed to update user. Please try again.";
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  // Reset form and errors
  Object.keys(errors).forEach((key) => {
    errors[key] = "";
  });
  submitError.value = "";
  loading.value = false;

  emit("close");
};
</script>
