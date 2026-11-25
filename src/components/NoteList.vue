
<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const notes = computed(() => store.getters['notes/filteredNotes'])
const selectedId = computed(() => store.state.notes.selectedNoteId)
const activeView = computed(() => store.state.notes.activeView)
const searchQuery = computed(() => store.state.notes.searchQuery)

const heading = computed(() => {
  const headings = {
    all: 'All Notes',
    favorites: 'Favorites',
    archived: 'Archived'
  }

  return headings[activeView.value]
})

function selectNote(note) {
  store.dispatch('notes/selectNote', note.id)
}

function search(event) {
  store.dispatch('notes/searchNotes', event.target.value)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <section class="note-list">
    <div class="list-header">
      <div>
        <h2>{{ heading }}</h2>
        <p>{{ notes.length }} notes</p>
      </div>
    </div>

    <div class="search-box">
      <span>⌕</span>
      <input
        :value="searchQuery"
        @input="search"
        placeholder="Search your notes..."
      />
      <span class="search-shortcut">/</span>
    </div>

    <div v-if="notes.length" class="notes-container">
      <button
        v-for="note in notes"
        :key="note.id"
        class="note-item"
        :class="{ selected: selectedId === note.id }"
        @click="selectNote(note)"
      >
        <div class="note-item-top">
          <h3>{{ note.title || 'Untitled Note' }}</h3>
          <span v-if="note.favorite" class="favorite-icon">★</span>
        </div>

        <p class="note-preview">
          {{ note.content || 'No content yet...' }}
        </p>

        <div class="note-meta">
          <span>{{ formatDate(note.updatedAt) }}</span>
          <span v-if="note.archived">Archived</span>
        </div>
      </button>
    </div>

    <div v-else class="empty-list">
      <span>▤</span>
      <h3>No notes found</h3>
      <p>Try another search or create a new note.</p>
    </div>
  </section>
</template>
