
<script setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const note = computed(() => store.getters['notes/selectedNote'])

const title = ref('')
const content = ref('')
const savedMessage = ref('')

let saveTimer = null

watch(note, (newNote) => {
  clearTimeout(saveTimer)

  if (newNote) {
    title.value = newNote.title
    content.value = newNote.content
  } else {
    title.value = ''
    content.value = ''
  }

  savedMessage.value = ''
}, { immediate: true })

function saveNote() {
  if (!note.value) return

  store.dispatch('notes/updateNote', {
    id: note.value.id,
    title: title.value,
    content: content.value
  })

  savedMessage.value = 'All changes saved'
}

function scheduleSave() {
  savedMessage.value = 'Saving...'

  clearTimeout(saveTimer)

  saveTimer = setTimeout(saveNote, 700)
}

function toggleFavorite() {
  if (note.value) {
    store.dispatch('notes/toggleFavorite', note.value.id)
  }
}

function toggleArchive() {
  if (note.value) {
    store.dispatch('notes/toggleArchive', note.value.id)
  }
}

function deleteNote() {
  if (!note.value) return

  const confirmed = window.confirm('Are you sure you want to delete this note?')

  if (confirmed) {
    store.dispatch('notes/deleteNote', note.value.id)
  }
}

function formatDate(date) {
  if (!date) return ''

  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onUnmounted(() => {
  if (saveTimer) {
    clearTimeout(saveTimer)
    if (note.value && savedMessage.value === 'Saving...') {
      saveNote()
    }
  }
})
</script>

<template>
  <main class="editor">
    <template v-if="note">
      <div class="editor-toolbar">
        <div class="save-status">
          <span class="status-dot"></span>
          {{ savedMessage || 'Ready to edit' }}
        </div>

        <div class="toolbar-actions">
          <button
            class="icon-btn"
            :title="note.favorite ? 'Remove favorite' : 'Add favorite'"
            @click="toggleFavorite"
          >
            {{ note.favorite ? '★' : '☆' }}
          </button>

          <button
            class="icon-btn"
            title="Archive"
            @click="toggleArchive"
          >
            ▣
          </button>

          <button
            class="icon-btn delete-btn"
            title="Delete note"
            @click="deleteNote"
          >
            🗑️
          </button>
        </div>
      </div>

      <div class="editor-content">
        <input
          v-model="title"
          class="editor-title"
          placeholder="Untitled Note"
          @input="scheduleSave"
        />

        <div class="editor-info">
          Last updated: {{ formatDate(note.updatedAt) }}
        </div>

        <textarea
          v-model="content"
          class="editor-textarea"
          placeholder="Start writing your thoughts..."
          @input="scheduleSave"
        ></textarea>
      </div>
    </template>

    <div v-else class="editor-empty">
      <div class="empty-icon">✎</div>
      <h2>Your thoughts deserve a space.</h2>
      <p>Select a note from the list or create a new one.</p>
    </div>
  </main>
</template>
