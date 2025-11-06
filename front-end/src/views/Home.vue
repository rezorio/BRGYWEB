<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="text-center">
          <h1
            class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            Welcome to
            <span class="text-blue-600">BRGY Portal</span>
          </h1>
          <p class="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            Your comprehensive barangay management system. Streamline services,
            connect with your community, and access essential resources all in
            one place.
          </p>
          <div class="mt-10 flex justify-center space-x-4">
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/register"
              class="btn-primary text-lg px-8 py-3"
            >
              Get Started
              <i class="fas fa-arrow-right ml-2"></i>
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/login"
              class="btn-outline text-lg px-8 py-3"
            >
              Sign In
            </router-link>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/dashboard"
              class="btn-primary text-lg px-8 py-3"
            >
              Go to Dashboard
              <i class="fas fa-tachometer-alt ml-2"></i>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Decorative background -->
      <div
        class="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2"
      >
        <div class="opacity-20">
          <i class="fas fa-building text-blue-600" style="font-size: 200px"></i>
        </div>
      </div>
      <div
        class="absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"
      >
        <div class="opacity-20">
          <i class="fas fa-users text-blue-400" style="font-size: 180px"></i>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            Everything You Need in One Platform
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Powerful features designed to make barangay management simple and
            efficient.
          </p>
        </div>

        <div class="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="card text-center hover:shadow-lg transition-shadow duration-300"
          >
            <div
              class="mx-auto w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4"
            >
              <i :class="feature.icon" class="text-blue-600 text-2xl"></i>
            </div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ feature.title }}
            </h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-extrabold text-gray-900">
            Trusted by Communities
          </h2>
          <p class="mt-4 text-lg text-gray-600">
            Join thousands of users already benefiting from our platform.
          </p>
        </div>

        <div class="mt-12 grid grid-cols-2 gap-8 lg:grid-cols-4">
          <div v-for="stat in stats" :key="stat.id" class="text-center">
            <div class="text-4xl font-bold text-blue-600">{{ stat.value }}</div>
            <div class="mt-2 text-lg font-medium text-gray-900">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="bg-blue-600">
      <div class="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold text-white">
          Ready to get started?
        </h2>
        <p class="mt-4 text-lg text-blue-200">
          Join your barangay's digital platform today and experience seamless
          community management.
        </p>
        <div class="mt-8">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/register"
            class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:text-lg transition duration-200"
          >
            Create Account
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated"
            to="/dashboard"
            class="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 md:text-lg transition duration-200"
          >
            Go to Dashboard
            <i class="fas fa-tachometer-alt ml-2"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const features = ref([
  {
    id: 1,
    icon: "fas fa-user-shield",
    title: "Secure Authentication",
    description:
      "Advanced security with role-based access control and JWT tokens to protect your data.",
  },
  {
    id: 2,
    icon: "fas fa-users-cog",
    title: "User Management",
    description:
      "Comprehensive user management system with role assignments and permission controls.",
  },
  {
    id: 3,
    icon: "fas fa-chart-line",
    title: "Analytics Dashboard",
    description:
      "Real-time insights and analytics to help you make informed decisions for your community.",
  },
  {
    id: 4,
    icon: "fas fa-file-alt",
    title: "Document Management",
    description:
      "Organize and manage important barangay documents with ease and security.",
  },
  {
    id: 5,
    icon: "fas fa-bell",
    title: "Notification System",
    description:
      "Stay informed with real-time notifications and updates from your barangay.",
  },
  {
    id: 6,
    icon: "fas fa-mobile-alt",
    title: "Mobile Responsive",
    description:
      "Access the platform from any device with our fully responsive mobile-friendly design.",
  },
]);

const stats = ref([
  { id: 1, value: "10,000+", label: "Active Users" },
  { id: 2, value: "500+", label: "Barangays" },
  { id: 3, value: "50,000+", label: "Services Delivered" },
  { id: 4, value: "99.9%", label: "Uptime" },
]);
</script>
