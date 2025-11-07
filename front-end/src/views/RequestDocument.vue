<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div
                class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
              >
                <i class="fas fa-building text-white text-sm"></i>
              </div>
            </div>
            <span class="ml-3 text-xl font-semibold text-gray-900"
              >Barangay Bagong Barrio</span
            >
          </div>

          <!-- Desktop Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <router-link
              to="/"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Home
            </router-link>
            <router-link
              to="/about"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              About
            </router-link>
            <router-link
              to="/contact"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Contact Us
            </router-link>
            <router-link
              to="/services"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
            >
              Services
            </router-link>
            <router-link
              to="/request-document"
              class="text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Request a Document
            </router-link>
          </div>

          <!-- Authentication Section -->
          <div class="hidden md:flex items-center space-x-4">
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center space-x-3"
            >
              <div
                class="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg"
              >
                <div
                  class="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center"
                >
                  <i class="fas fa-user text-blue-600 text-xs"></i>
                </div>
                <span class="text-sm font-medium text-gray-900">
                  {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
                </span>
              </div>
              <router-link
                to="/dashboard"
                class="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Dashboard
              </router-link>
            </div>

            <div v-else>
              <router-link
                to="/login"
                class="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <i class="fas fa-sign-in-alt mr-2"></i>
                Log In
              </router-link>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden flex items-center space-x-2">
            <button
              @click="toggleMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Document Request Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Request a Document
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Apply for barangay certificates and documents online. Fast,
          convenient, and secure processing.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Document Types -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-4">
              Available Documents
            </h2>
            <div class="space-y-2">
              <button
                v-for="doc in documentTypes"
                :key="doc.id"
                @click="selectDocument(doc)"
                :class="[
                  'w-full text-left p-3 rounded-lg transition-colors duration-200',
                  selectedDocument?.id === doc.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100',
                ]"
              >
                <div class="flex items-center space-x-3">
                  <i :class="doc.icon" class="text-lg"></i>
                  <div>
                    <p class="font-medium">{{ doc.name }}</p>
                    <p class="text-xs opacity-75">{{ doc.description }}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Request Form -->
        <div class="lg:col-span-2">
          <div
            v-if="selectedDocument"
            class="bg-white rounded-2xl shadow-xl p-8"
          >
            <div class="mb-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">
                Request {{ selectedDocument.name }}
              </h2>
              <p class="text-gray-600">{{ selectedDocument.description }}</p>
            </div>

            <form @submit.prevent="submitRequest" class="space-y-6">
              <!-- Personal Information -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >First Name *</label
                    >
                    <input
                      v-model="form.firstName"
                      type="text"
                      required
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Last Name *</label
                    >
                    <input
                      v-model="form.lastName"
                      type="text"
                      required
                      class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter last name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Middle Name</label
                    >
                    <input
                      v-model="form.middleName"
                      type="text"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Contact Number *</label
                    >
                    <input
                      v-model="form.contactNumber"
                      type="tel"
                      required
                      class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contact number"
                    />
                  </div>
                </div>
              </div>

              <!-- Address Information -->
              <div class="border-b border-gray-200 pb-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Address Information
                </h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >House/Unit Number *</label
                    >
                    <input
                      v-model="form.houseNumber"
                      type="text"
                      required
                      class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter house/unit number"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Street/Village *</label
                    >
                    <input
                      v-model="form.street"
                      type="text"
                      required
                      class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street or village name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2"
                      >Length of Residence *</label
                    >
                    <input
                      v-model="form.lengthOfResidence"
                      type="text"
                      required
                      class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5 years, 6 months"
                    />
                  </div>
                </div>
              </div>

              <!-- Purpose -->
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                  Purpose of Request *
                </h3>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2"
                    >Specify Purpose</label
                  >
                  <textarea
                    v-model="form.purpose"
                    required
                    rows="3"
                    class="w-full px-4 py-3-border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please specify the purpose of your document request..."
                  ></textarea>
                </div>
              </div>

              <!-- Requirements -->
              <div class="bg-blue-50 rounded-lg p-4">
                <h4 class="font-medium text-blue-900 mb-2">Requirements:</h4>
                <ul class="text-sm text-blue-800 space-y-1">
                  <li
                    v-for="requirement in selectedDocument.requirements"
                    :key="requirement"
                  >
                    • {{ requirement }}
                  </li>
                </ul>
              </div>

              <!-- Submit Button -->
              <div class="flex items-center justify-between">
                <button
                  type="button"
                  @click="resetForm"
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Form
                </button>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i
                    v-if="isSubmitting"
                    class="fas fa-spinner fa-spin mr-2"
                  ></i>
                  {{ isSubmitting ? "Submitting..." : "Submit Request" }}
                </button>
              </div>
            </form>
          </div>

          <!-- Initial State -->
          <div v-else class="bg-white rounded-2xl shadow-xl p-8 text-center">
            <i class="fas fa-file-alt text-blue-600 text-6xl mb-4"></i>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Select a Document Type
            </h3>
            <p class="text-gray-600">
              Choose from the available document types on the left to start your
              request.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const showMobileMenu = ref(false);
const isSubmitting = ref(false);

const documentTypes = ref([
  {
    id: 1,
    name: "Barangay Certificate",
    description: "Proof of residency in the barangay",
    icon: "fas fa-file-certificate",
    requirements: [
      "Valid ID",
      "Proof of residence (utility bill, etc.)",
      "Accomplished application form",
    ],
  },
  {
    id: 2,
    name: "Residency Certificate",
    description: "Certificate of residency for specific purposes",
    icon: "fas fa-home",
    requirements: ["Valid ID", "Proof of residence", "Purpose documentation"],
  },
  {
    id: 3,
    name: "Clearance Certificate",
    description: "Police/barangay clearance for employment or other purposes",
    icon: "fas fa-shield-check",
    requirements: [
      "Valid ID",
      "Community tax certificate",
      "Proof of residence",
    ],
  },
  {
    id: 4,
    name: "Indigency Certificate",
    description: "Certificate for financial assistance programs",
    icon: "fas fa-hands-helping",
    requirements: [
      "Valid ID",
      "Proof of low income",
      "Case study social worker report (if applicable)",
    ],
  },
  {
    id: 5,
    name: "Business Permit",
    description: "Permit to operate business within the barangay",
    icon: "fas fa-briefcase",
    requirements: [
      "Valid ID",
      "Business registration documents",
      "Proof of address",
      "Sanitary permit (if applicable)",
    ],
  },
]);

const selectedDocument = ref(null);
const form = ref({
  firstName: "",
  lastName: "",
  middleName: "",
  contactNumber: "",
  houseNumber: "",
  street: "",
  lengthOfResidence: "",
  purpose: "",
});

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const selectDocument = (document) => {
  selectedDocument.value = document;
  resetForm();
};

const resetForm = () => {
  form.value = {
    firstName: "",
    lastName: "",
    middleName: "",
    contactNumber: "",
    houseNumber: "",
    street: "",
    lengthOfResidence: "",
    purpose: "",
  };
};

const submitRequest = async () => {
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    alert(
      `Your request for ${selectedDocument.value.name} has been submitted successfully! We will process it within 3-5 working days.`,
    );
    resetForm();
  } catch {
    alert("Error submitting request. Please try again.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
