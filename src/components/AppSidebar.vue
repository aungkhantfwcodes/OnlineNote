
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const activeView = computed(() => store.state.notes.activeView)
const totalNotes = computed(() => store.getters['notes/totalNotes'])
const totalFavorites = computed(() => store.getters['notes/totalFavorites'])
const darkMode = computed(() => store.state.notes.darkMode)

function changeView(view) {
  store.dispatch('notes/changeView', view)
}

function createNote() {
  store.dispatch('notes/createNote')
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">N</div>
      <span>Notebook</span>
    </div>

    <button class="new-note-btn" @click="createNote">
      <span>+</span>
      New Note
    </button>

    <div class="sidebar-group">
      <p class="sidebar-label">WORKSPACE</p>

      <button
        class="nav-item"
        :class="{ active: activeView === 'all' }"
        @click="changeView('all')"
      >
        <span>▤</span>
        All Notes
        <span class="nav-count">{{ totalNotes }}</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: activeView === 'favorites' }"
        @click="changeView('favorites')"
      >
        <span>☆</span>
        Favorites
        <span class="nav-count">{{ totalFavorites }}</span>
      </button>

      <button
        class="nav-item"
        :class="{ active: activeView === 'archived' }"
        @click="changeView('archived')"
      >
        <span>▣</span>
        Archived
      </button>
    </div>

    <div class="sidebar-bottom">
      <button
        class="nav-item theme-toggle"
        @click="store.dispatch('notes/toggleDarkMode')"
      >
        <span>{{ darkMode ? '☀' : '☾' }}</span>
        {{ darkMode ? 'Light Mode' : 'Dark Mode' }}
      </button>

      <div class="profile">
        <div class="avatar">U</div>
        <div>
          <strong>My Workspace</strong>
          <small>Personal Notebook</small>
        </div>
      </div>
    </div>
  </aside>
</template>
