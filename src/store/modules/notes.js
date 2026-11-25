
const STORAGE_KEY = 'online-notebook-notes'

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (saved) {
      return JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load notes:', error)
  }

  return [
    {
      id: 1,
      title: 'Welcome to My Notebook',
      content: 'Welcome! Start organizing your ideas here.\n\nCreate your first note and explore the application.',
      favorite: true,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Learning Vuex',
      content: 'Vuex is a state management pattern and library for Vue.js applications.\n\nIt provides a centralized store for all the components.',
      favorite: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
}

const state = {
  notes: loadNotes(),
  selectedNoteId: null,
  searchQuery: '',
  activeView: 'all',
  darkMode: localStorage.getItem('notebook-dark-mode') === 'true'
}

const getters = {
  allNotes: state => state.notes.filter(note => !note.archived),

  favoriteNotes: state =>
    state.notes.filter(note => note.favorite && !note.archived),

  archivedNotes: state =>
    state.notes.filter(note => note.archived),

  selectedNote: state =>
    state.notes.find(note => note.id === state.selectedNoteId) || null,

  filteredNotes: state => {
    let notes = state.notes

    if (state.activeView === 'all') {
      notes = notes.filter(note => !note.archived)
    }

    if (state.activeView === 'favorites') {
      notes = notes.filter(note => note.favorite && !note.archived)
    }

    if (state.activeView === 'archived') {
      notes = notes.filter(note => note.archived)
    }

    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase()

      notes = notes.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
      )
    }

    return [...notes].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    )
  },

  totalNotes: state =>
    state.notes.filter(note => !note.archived).length,

  totalFavorites: state =>
    state.notes.filter(note => note.favorite && !note.archived).length
}

const mutations = {
  ADD_NOTE(state, note) {
    state.notes.unshift(note)
    state.selectedNoteId = note.id
  },

  UPDATE_NOTE(state, updatedNote) {
    const index = state.notes.findIndex(
      note => note.id === updatedNote.id
    )

    if (index !== -1) {
      state.notes.splice(index, 1, updatedNote)
    }
  },

  DELETE_NOTE(state, id) {
    state.notes = state.notes.filter(note => note.id !== id)

    if (state.selectedNoteId === id) {
      state.selectedNoteId = null
    }
  },

  SELECT_NOTE(state, id) {
    state.selectedNoteId = id
  },

  TOGGLE_FAVORITE(state, id) {
    const note = state.notes.find(note => note.id === id)

    if (note) {
      note.favorite = !note.favorite
      note.updatedAt = new Date().toISOString()
    }
  },

  TOGGLE_ARCHIVE(state, id) {
    const note = state.notes.find(note => note.id === id)

    if (note) {
      note.archived = !note.archived
      note.updatedAt = new Date().toISOString()

      if (state.selectedNoteId === id) {
        state.selectedNoteId = null
      }
    }
  },

  SET_SEARCH_QUERY(state, query) {
    state.searchQuery = query
  },

  SET_ACTIVE_VIEW(state, view) {
    state.activeView = view
    state.selectedNoteId = null
    state.searchQuery = ''
  },

  SET_DARK_MODE(state, value) {
    state.darkMode = value
    localStorage.setItem('notebook-dark-mode', value)
  }
}

const actions = {
  createNote({ commit }) {
    const now = new Date().toISOString()

    const note = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      favorite: false,
      archived: false,
      createdAt: now,
      updatedAt: now
    }

    commit('ADD_NOTE', note)
  },

  updateNote({ commit, state }, data) {
    const currentNote = state.notes.find(
      note => note.id === data.id
    )

    if (!currentNote) return

    commit('UPDATE_NOTE', {
      ...currentNote,
      ...data,
      updatedAt: new Date().toISOString()
    })
  },

  deleteNote({ commit }, id) {
    commit('DELETE_NOTE', id)
  },

  selectNote({ commit }, id) {
    commit('SELECT_NOTE', id)
  },

  toggleFavorite({ commit }, id) {
    commit('TOGGLE_FAVORITE', id)
  },

  toggleArchive({ commit }, id) {
    commit('TOGGLE_ARCHIVE', id)
  },

  searchNotes({ commit }, query) {
    commit('SET_SEARCH_QUERY', query)
  },

  changeView({ commit }, view) {
    commit('SET_ACTIVE_VIEW', view)
  },

  toggleDarkMode({ commit, state }) {
    commit('SET_DARK_MODE', !state.darkMode)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
