<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navigation v-if="!isAuthPage && !isHomePage" />
    <main :class="{ 'pt-16': !isAuthPage && !isHomePage }">
      <router-view />
    </main>
    <ToastNotification />
    <SessionWarning />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navigation from "./components/layout/Navigation.vue";
import ToastNotification from "./components/common/ToastNotification.vue";
import SessionWarning from "./components/common/SessionWarning.vue";

const route = useRoute();

const isAuthPage = computed(() => {
  return route.name === "login" || route.name === "register";
});

const isHomePage = computed(() => {
  return route.name === "home";
});
</script>
