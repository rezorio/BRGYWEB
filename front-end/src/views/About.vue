<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <!-- Navigation Bar (same as Home) -->
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
              class="text-blue-600 px-3 py-2 text-sm font-medium"
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

    <!-- About Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          About Barangay Bagong Barrio
        </h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Learn more about our community, our mission, and the services we
          provide to our residents.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p class="text-gray-600 mb-6">
            To serve the residents of Barangay Bagong Barrio with dedication,
            integrity, and excellence. We strive to provide efficient public
            services, foster community development, and maintain peace and order
            within our barangay.
          </p>

          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Our Vision</h2>
          <p class="text-gray-600 mb-6">
            A progressive, peaceful, and self-reliant community where residents
            enjoy quality public services, sustainable development, and a high
            quality of life.
          </p>

          <h2 class="text-2xl font-semibold text-gray-900 mb-4">Core Values</h2>
          <ul class="space-y-2 text-gray-600">
            <li class="flex items-center">
              <i class="fas fa-check-circle text-blue-600 mr-3"></i>
              Service Excellence
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-blue-600 mr-3"></i>
              Transparency and Accountability
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-blue-600 mr-3"></i>
              Community Participation
            </li>
            <li class="flex items-center">
              <i class="fas fa-check-circle text-blue-600 mr-3"></i>
              Integrity and Honesty
            </li>
          </ul>
        </div>

        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="text-center">
            <i class="fas fa-landmark text-blue-600 text-6xl mb-6"></i>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">
              Barangay Hall Information
            </h3>
            <div class="space-y-4 text-left">
              <div class="flex items-start space-x-3">
                <i class="fas fa-map-marker-alt text-blue-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">Address</p>
                  <p class="text-gray-600">Bagong Barrio, City</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-phone text-blue-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">Contact Number</p>
                  <p class="text-gray-600">(123) 456-7890</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-envelope text-blue-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">Email</p>
                  <p class="text-gray-600">bagongbarrio@barangay.gov</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <i class="fas fa-clock text-blue-600 mt-1"></i>
                <div>
                  <p class="font-medium text-gray-900">Office Hours</p>
                  <p class="text-gray-600">
                    Monday - Friday: 8:00 AM - 5:00 PM
                  </p>
                  <p class="text-gray-600">Saturday: 8:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>
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

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};
</script>
