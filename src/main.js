
import { createApp } from 'vue'

import App from './App.vue'
import store from './store'
import router from './router'
import { supabase } from './lib/supabase'

import './styles/main.scss'

supabase
  .from('notes')
  .select('*')
  .then(({ data, error }) => {
    console.log('Supabase data:', data)
    console.log('Supabase error:', error)
  })

createApp(App)
  .use(store)
  .use(router)
  .mount('#app')
