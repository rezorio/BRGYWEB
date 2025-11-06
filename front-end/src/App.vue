<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <Navigation v-if="!isAuthPage" />
    <main :class="{ 'pt-16': !isAuthPage }">
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
</script>
