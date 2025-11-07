<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Profile</h1>
            <p class="mt-1 text-sm text-gray-600">
              Manage your personal information and account settings
            </p>
          </div>
          <router-link to="/dashboard" class="btn-outline">
            <i class="fas fa-arrow-left mr-2"></i>
            Back to Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Information -->
        <div class="lg:col-span-2">
          <div class="card">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
              <button
                @click="toggleEditMode"
                :class="editMode ? 'btn-danger' : 'btn-primary'"
                class="text-sm"
              >
                <i
                  :class="editMode ? 'fas fa-times' : 'fas fa-edit'"
                  class="mr-1"
                ></i>
                {{ editMode ? "Cancel" : "Edit Profile" }}
              </button>
            </div>

            <!-- Profile Form -->
            <form @submit.prevent="handleUpdateProfile">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- First Name -->
                <div>
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    id="firstName"
                    v-model="profileForm.firstName"
                    type="text"
                    :disabled="!editMode"
                    class="form-input"
                    :class="{ 'bg-gray-50': !editMode }"
                  />
                </div>

                <!-- Last Name -->
                <div>
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    id="lastName"
                    v-model="profileForm.lastName"
                    type="text"
                    :disabled="!editMode"
                    class="form-input"
                    :class="{ 'bg-gray-50': !editMode }"
                  />
                </div>

                <!-- Email -->
                <div>
                  <label for="email" class="form-label">Email Address</label>
                  <input
                    id="email"
                    v-model="profileForm.email"
                    type="email"
                    disabled
                    class="form-input bg-gray-50"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact admin for assistance.
                  </p>
                </div>

                <!-- Role -->
                <div>
                  <label for="role" class="form-label">Role</label>
                  <input
                    id="role"
                    :value="authStore.userRole"
                    type="text"
                    disabled
                    class="form-input bg-gray-50"
                  />
                  <p class="text-xs text-gray-500 mt-1">
                    Role is assigned by administrator.
                  </p>
                </div>

                <!-- Phone -->
                <div>
                  <label for="phone" class="form-label">Phone Number</label>
                  <input
                    id="phone"
                    v-model="profileForm.phone"
                    type="tel"
                    :disabled="!editMode"
                    class="form-input"
                    :class="{ 'bg-gray-50': !editMode }"
                    placeholder="+63 XXX XXX XXXX"
                  />
                </div>

                <!-- Address -->
                <div>
                  <label for="address" class="form-label">Address</label>
                  <input
                    id="address"
                    v-model="profileForm.address"
                    type="text"
                    :disabled="!editMode"
                    class="form-input"
                    :class="{ 'bg-gray-50': !editMode }"
                    placeholder="Enter your address"
                  />
                </div>

                <!-- Bio -->
                <div class="md:col-span-2">
                  <label for="bio" class="form-label">Bio</label>
                  <textarea
                    id="bio"
                    v-model="profileForm.bio"
                    :disabled="!editMode"
                    rows="4"
                    class="form-input"
                    :class="{ 'bg-gray-50': !editMode }"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>

              <!-- Save Button -->
              <div v-if="editMode" class="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  @click="toggleEditMode"
                  class="btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" :disabled="loading" class="btn-primary">
                  <span v-if="loading" class="loading-spinner mr-2"></span>
                  {{ loading ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password -->
          <div class="card mt-8">
            <h2 class="text-lg font-semibold text-gray-900 mb-6">
              Change Password
            </h2>
            <form @submit.prevent="handleChangePassword">
              <div class="space-y-4">
                <!-- Current Password -->
                <div>
                  <label for="currentPassword" class="form-label"
                    >Current Password</label
                  >
                  <input
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    type="password"
                    class="form-input"
                    placeholder="Enter current password"
                  />
                </div>

                <!-- New Password -->
                <div>
                  <label for="newPassword" class="form-label"
                    >New Password</label
                  >
                  <input
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    type="password"
                    class="form-input"
                    placeholder="Enter new password (min 6 chars, 1 special char)"
                  />
                </div>

                <!-- Confirm New Password -->
                <div>
                  <label for="confirmNewPassword" class="form-label"
                    >Confirm New Password</label
                  >
                  <input
                    id="confirmNewPassword"
                    v-model="passwordForm.confirmNewPassword"
                    type="password"
                    class="form-input"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div class="mt-6">
                <button
                  type="submit"
                  :disabled="passwordLoading"
                  class="btn-primary"
                >
                  <span
                    v-if="passwordLoading"
                    class="loading-spinner mr-2"
                  ></span>
                  {{ passwordLoading ? "Updating..." : "Update Password" }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-8">
          <!-- Profile Picture -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Profile Picture
            </h3>
            <div class="text-center">
              <div
                class="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-user text-blue-600 text-3xl"></i>
              </div>
              <button class="mt-4 btn-outline text-sm">
                <i class="fas fa-camera mr-1"></i>
                Change Photo
              </button>
            </div>
          </div>

          <!-- Account Status -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Account Status
            </h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Status</span>
                <span
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  <i class="fas fa-check-circle mr-1"></i>
                  Active
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Member Since</span>
                <span class="text-sm text-gray-900">{{ formatDate() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-600">Last Login</span>
                <span class="text-sm text-gray-900">Today at 9:30 AM</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div class="space-y-2">
              <button
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <i class="fas fa-download text-blue-600 mr-2"></i>
                <span class="text-sm">Download My Data</span>
              </button>
              <button
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <i class="fas fa-shield-alt text-green-600 mr-2"></i>
                <span class="text-sm">Privacy Settings</span>
              </button>
              <button
                class="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                <i class="fas fa-question-circle text-purple-600 mr-2"></i>
                <span class="text-sm">Help & Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useToastStore } from "@/stores/toast";

const authStore = useAuthStore();
const toastStore = useToastStore();

const editMode = ref(false);
const loading = ref(false);
const passwordLoading = ref(false);

const profileForm = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  bio: "",
});

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    // Reset form to original values
    loadProfileData();
  }
};

const loadProfileData = () => {
  const user = authStore.user;
  profileForm.firstName = user?.firstName || "";
  profileForm.lastName = user?.lastName || "";
  profileForm.email = user?.email || "";
  profileForm.phone = "+63 912 345 6789"; // Mock data
  profileForm.address = "123 Main St, Barangay Central"; // Mock data
  profileForm.bio = "Active community member"; // Mock data
};

const handleUpdateProfile = async () => {
  try {
    loading.value = true;

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toastStore.showSuccess("Profile updated successfully!");
    editMode.value = false;
  } catch {
    toastStore.showError("Failed to update profile");
  } finally {
    loading.value = false;
  }
};

const handleChangePassword = async () => {
  // Validation
  if (
    !passwordForm.currentPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmNewPassword
  ) {
    toastStore.showError("Please fill in all password fields");
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    toastStore.showError("New passwords do not match");
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    toastStore.showError("New password must be at least 6 characters");
    return;
  }

  // Check for special character
  const specialCharRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  if (!specialCharRegex.test(passwordForm.newPassword)) {
    toastStore.showError(
      "New password must include at least one special character",
    );
    return;
  }

  try {
    passwordLoading.value = true;

    // Call actual API endpoint
    await authStore.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
      confirmNewPassword: passwordForm.confirmNewPassword,
    });

    toastStore.showSuccess("Password changed successfully!");

    // Reset form
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmNewPassword = "";
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "Failed to change password";
    toastStore.showError(errorMessage);
  } finally {
    passwordLoading.value = false;
  }
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
  loadProfileData();
});
</script>
