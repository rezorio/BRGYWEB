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
              class="text-blue-600 px-3 py-2 text-sm font-medium"
            >
              Services
            </router-link>
            <router-link
              to="/request-document"
              class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <i class="fas fa-file-alt mr-2"></i>
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

    <!-- Services Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Barangay Bagong Barrio offers a comprehensive range of services to
          serve our community better.
        </p>
      </div>

      <!-- Service Categories -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <div
          v-for="service in services"
          :key="service.id"
          class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
        >
          <div class="p-6">
            <div
              class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4"
            >
              <i :class="service.icon" class="text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              {{ service.title }}
            </h3>
            <p class="text-gray-600 mb-4">{{ service.description }}</p>
            <ul class="space-y-2 text-sm text-gray-600">
              <li
                v-for="feature in service.features"
                :key="feature"
                class="flex items-center"
              >
                <i class="fas fa-check text-green-500 mr-2"></i>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Document Services Section -->
      <div class="bg-blue-600 rounded-2xl p-8 text-white mb-16">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Need Official Documents?</h2>
          <p class="text-xl mb-8 opacity-90">
            Request barangay certificates, clearances, and other documents
            online through our portal.
          </p>
          <router-link
            to="/request-document"
            class="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            <i class="fas fa-file-alt mr-3"></i>
            Request a Document
          </router-link>
        </div>
      </div>

      <!-- Service Process -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-3xl font-bold text-gray-900 mb-6">
            How to Avail Our Services
          </h2>
          <div class="space-y-6">
            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white font-bold">1</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Visit Our Office
                </h3>
                <p class="text-gray-600">
                  Come to the barangay hall during office hours with your
                  requirements.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white font-bold">2</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Submit Requirements
                </h3>
                <p class="text-gray-600">
                  Present necessary documents and fill out the required forms.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white font-bold">3</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Processing
                </h3>
                <p class="text-gray-600">
                  Our staff will process your request promptly and efficiently.
                </p>
              </div>
            </div>

            <div class="flex items-start space-x-4">
              <div
                class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <span class="text-white font-bold">4</span>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Receive Service
                </h3>
                <p class="text-gray-600">
                  Get your documents or services on the promised date.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Service Hours</h3>
          <div class="space-y-4">
            <div
              class="flex justify-between items-center py-3 border-b border-gray-200"
            >
              <span class="font-medium text-gray-900">Monday - Friday</span>
              <span class="text-gray-600">8:00 AM - 5:00 PM</span>
            </div>
            <div
              class="flex justify-between items-center py-3 border-b border-gray-200"
            >
              <span class="font-medium text-gray-900">Saturday</span>
              <span class="text-gray-600">8:00 AM - 12:00 PM</span>
            </div>
            <div
              class="flex justify-between items-center py-3 border-b border-gray-200"
            >
              <span class="font-medium text-gray-900">Sunday</span>
              <span class="text-gray-600">Closed</span>
            </div>
            <div class="flex justify-between items-center py-3">
              <span class="font-medium text-gray-900">Holidays</span>
              <span class="text-gray-600">Closed</span>
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-800">
              <i class="fas fa-info-circle mr-2"></i>
              For emergency services, please call our hotline: (123) 456-7891
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

const services = ref([
  {
    id: 1,
    icon: "fas fa-file-certificate",
    title: "Document Services",
    description: "Official barangay documents and certificates",
    features: [
      "Barangay Certificate",
      "Residency Certificate",
      "Clearance Certificate",
      "Indigency Certificate",
    ],
  },
  {
    id: 2,
    icon: "fas fa-hands-helping",
    title: "Social Services",
    description: "Assistance programs for residents in need",
    features: [
      "Financial Assistance",
      "Medical Assistance",
      "Educational Support",
      "Livelihood Programs",
    ],
  },
  {
    id: 3,
    icon: "fas fa-shield-alt",
    title: "Peace & Order",
    description: "Maintaining safety and security in the community",
    features: [
      "Tanod Services",
      "Dispute Resolution",
      "Emergency Response",
      "Community Watch",
    ],
  },
  {
    id: 4,
    icon: "fas fa-broom",
    title: "Environmental Services",
    description: "Clean and green programs for the community",
    features: [
      "Waste Management",
      "Tree Planting",
      "Clean-up Drives",
      "Recycling Programs",
    ],
  },
  {
    id: 5,
    icon: "fas fa-users",
    title: "Community Development",
    description: "Programs for community growth and development",
    features: [
      "Youth Programs",
      "Senior Citizens Services",
      "Women's Development",
      "Sports Activities",
    ],
  },
  {
    id: 6,
    icon: "fas fa-heartbeat",
    title: "Health Services",
    description: "Basic health and wellness programs",
    features: [
      "Health Check-ups",
      "Vaccination Programs",
      "Health Education",
      "Medical Referrals",
    ],
  },
]);

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
</script>
