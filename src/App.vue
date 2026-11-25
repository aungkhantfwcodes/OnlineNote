
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const darkMode = computed(() => store.state.notes.darkMode)
</script>

<template>
  <div class="app" :class="{ 'dark-mode': darkMode }">
    <router-view />
  </div>
</template>
