
<script setup>
import AppSidebar from '../components/AppSidebar.vue'
import NoteList from '../components/NoteList.vue'
import NoteEditor from '../components/NoteEditor.vue'
</script>

<template>
  <div class="dashboard">
    <AppSidebar />
    <NoteList />
    <NoteEditor />
  </div>
</template>
