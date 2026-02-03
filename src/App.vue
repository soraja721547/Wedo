<script setup lang="ts">
import { ref, provide, onMounted } from 'vue';
import TodoBoard from './components/TodoBoard.vue';

const deferredPrompt = ref<any>(null);

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
  });
});

const installPWA = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    deferredPrompt.value = null;
  }
};

provide('installPWA', installPWA);
provide('canInstall', deferredPrompt);
</script>

<template>
  <main>
    <TodoBoard />
  </main>
</template>

<style>
/* Global styles are in style.css */
</style>
