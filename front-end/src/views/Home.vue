<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <!-- Modern Navigation Bar -->
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
              class="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <i class="fas fa-file-alt mr-2"></i>
              Request a Document
            </router-link>
          </div>

          <!-- Authentication Section -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Authenticated User -->
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center space-x-3"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                ></div>
                <span class="text-sm text-gray-600">Logged in as:</span>
              </div>
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
                <span
                  class="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full"
                >
                  {{ authStore.userRole }}
                </span>
              </div>
              <router-link
                to="/dashboard"
                class="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Dashboard
              </router-link>
            </div>

            <!-- Unauthenticated User - Unified Log In Button -->
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
            <!-- Mobile Auth Status -->
            <div
              v-if="authStore.isAuthenticated"
              class="flex items-center space-x-2"
            >
              <div
                class="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              ></div>
              <span class="text-xs text-gray-600 font-medium">
                {{ authStore.user?.firstName }}
              </span>
            </div>
            <button
              @click="toggleMobileMenu"
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Navigation Menu -->
        <transition name="slide-down">
          <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
            <div class="px-2 pt-2 pb-3 space-y-1">
              <!-- Mobile Navigation Links -->
              <router-link
                to="/about"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-info-circle mr-3"></i>
                About
              </router-link>
              <router-link
                to="/contact"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-envelope mr-3"></i>
                Contact Us
              </router-link>
              <router-link
                to="/services"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-concierge-bell mr-3"></i>
                Services
              </router-link>
              <router-link
                to="/request-document"
                class="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                @click="closeMobileMenu"
              >
                <i class="fas fa-file-alt mr-3"></i>
                Request a Document
              </router-link>

              <!-- Mobile Authentication Section -->
              <div class="border-t border-gray-200 pt-3 mt-3">
                <div v-if="authStore.isAuthenticated" class="space-y-2">
                  <div class="px-3 py-2 bg-blue-50 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div
                        class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"
                      >
                        <i class="fas fa-user text-blue-600 text-sm"></i>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900">
                          {{ authStore.user?.firstName }}
                          {{ authStore.user?.lastName }}
                        </p>
                        <p class="text-xs text-gray-600">
                          {{ authStore.user?.email }}
                        </p>
                        <span
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1"
                        >
                          {{ authStore.userRole }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <router-link
                    to="/dashboard"
                    class="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    @click="closeMobileMenu"
                  >
                    <i class="fas fa-tachometer-alt mr-3"></i>
                    Dashboard
                  </router-link>
                </div>

                <div v-else>
                  <router-link
                    to="/login"
                    class="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                    @click="closeMobileMenu"
                  >
                    <i class="fas fa-sign-in-alt mr-3"></i>
                    Log In
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div class="text-center">
          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
          >
            Welcome to
            <span class="text-blue-600">Barangay Bagong Barrio</span>
          </h1>
          <p
            class="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed"
          >
            Your comprehensive barangay management system. Streamline services,
            connect with your community, and access essential resources all in
            one secure platform.
          </p>
          <div
            class="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="w-full sm:w-auto bg-blue-600 text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Get Started
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="w-full sm:w-auto border border-blue-600 text-blue-600 text-lg font-medium px-8 py-4 rounded-lg hover:bg-blue-50-transition-all duration-200"
            >
              Sign In
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="w-full sm:w-auto bg-blue-600 text-white text-lg font-medium px-8 py-4 rounded-lg hover:bg-blue-700-transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Go to Dashboard
              <i class="fas fa-tachometer-alt ml-2"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Decorative background elements -->
      <div class="absolute top-10 left-10 opacity-10 hidden lg:block">
        <i class="fas fa-building text-blue-600" style="font-size: 120px"></i>
      </div>
      <div class="absolute bottom-10 right-10 opacity-10 hidden lg:block">
        <i class="fas fa-users text-blue-400" style="font-size: 100px"></i>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 lg:py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything You Need in One Platform
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make barangay management simple,
            efficient, and transparent.
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="text-center p-6 rounded-xl hover:shadow-lg-transition-all duration-300 hover:-translate-y-1"
          >
            <div
              class="mx-auto w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6"
            >
              <i :class="feature.icon" class="text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Community Info Section -->
    <div class="py-16 lg:py-24 bg-blue-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900">
            Serving Our Community
          </h2>
          <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting residents with essential services and fostering community
            engagement.
          </p>
        </div>

        <div class="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-file-alt text-white"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Document Requests
                </h3>
                <p class="text-gray-600">
                  Request barangay certificates, clearances, and other documents
                  online.
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-calendar-check text-white"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Service Scheduling
                </h3>
                <p class="text-gray-600">
                  Book appointments and schedule barangay services conveniently.
                </p>
              </div>
            </div>
            <div class="flex items-start space-x-4">
              <div
                class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-bullhorn text-white"></i>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  Announcements
                </h3>
                <p class="text-gray-600">
                  Stay updated with the latest barangay news and important
                  notices.
                </p>
              </div>
            </div>
          </div>
          <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center">
              <i class="fas fa-users text-blue-600 text-4xl mb-4"></i>
              <h3 class="text-2xl font-bold text-gray-900 mb-2">
                Community First
              </h3>
              <p class="text-gray-600 mb-6">
                Join thousands of residents already using our platform to access
                barangay services efficiently.
              </p>
              <div class="grid grid-cols-2 gap-4 text-center">
                <div class="bg-blue-50 rounded-lg p-4">
                  <div class="text-2xl font-bold text-blue-600">24/7</div>
                  <div class="text-sm text-gray-600">Access</div>
                </div>
                <div class="bg-blue-50 rounded-lg p-4">
                  <div class="text-2xl font-bold text-blue-600">100%</div>
                  <div class="text-sm text-gray-600">Digital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-600">
      <div
        class="max-w-4xl mx-auto text-center py-16 lg:py-20 px-4 sm:px-6 lg:px-8"
      >
        <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p class="text-lg sm:text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
          Join your barangay's digital platform today and experience seamless
          community management services.
        </p>
        <div
          class="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4"
        >
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50-transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Create Account
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="w-full sm:w-auto bg-white text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-50-transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go to Dashboard
            <i class="fas fa-tachometer-alt ml-2"></i>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <div class="flex items-center justify-center space-x-2 mb-4">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <i class="fas fa-building text-white text-sm"></i>
            </div>
            <span class="text-xl font-semibold">Barangay Bagong Barrio</span>
          </div>
          <p class="text-gray-400 mb-4">
            Serving the community with digital excellence
          </p>
          <div class="flex justify-center space-x-4 text-sm text-gray-500">
            <span> 2024 Barangay Bagong Barrio</span>
            <span>•</span>
            <span>All rights reserved</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const showMobileMenu = ref(false);

// Initialize authentication state on component mount
onMounted(async () => {
  try {
    await authStore.initializeSession();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to initialize authentication session:", error);
  }
});

// Mobile menu functions
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const features = ref([
  {
    id: 1,
    icon: "fas fa-user-shield",
    title: "Secure Authentication",
    description:
      "Advanced security with role-based access control and JWT tokens to protect your data and privacy.",
  },
  {
    id: 2,
    icon: "fas fa-users-cog",
    title: "User Management",
    description:
      "Comprehensive user management system with role assignments and permission controls for secure access.",
  },
  {
    id: 3,
    icon: "fas fa-chart-line",
    title: "Analytics Dashboard",
    description:
      "Real-time insights and analytics to help you make informed decisions for your community development.",
  },
  {
    id: 4,
    icon: "fas fa-file-alt",
    title: "Document Management",
    description:
      "Organize and manage important barangay documents with ease and security for all residents.",
  },
  {
    id: 5,
    icon: "fas fa-bell",
    title: "Notification System",
    description:
      "Stay informed with real-time notifications and updates from your barangay office and community.",
  },
  {
    id: 6,
    icon: "fas fa-mobile-alt",
    title: "Mobile Responsive",
    description:
      "Access the platform from any device with our fully responsive mobile-friendly design.",
  },
]);
</script>
