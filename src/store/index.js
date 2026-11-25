import { createStore } from 'vuex'
import notes from './modules/notes'

const store = createStore({
  modules: {
    notes
  }
})

store.subscribe((mutation, state) => {
  localStorage.setItem(
    'online-notebook-notes',
    JSON.stringify(state.notes.notes)
  )
})

export default store