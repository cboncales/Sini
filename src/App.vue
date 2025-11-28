<script setup>
import { ref, onMounted } from 'vue'
import Sidebar from './components/Sidebar.vue'
import MovieGrid from './components/MovieGrid.vue'
import MovieDetailModal from './components/MovieDetailModal.vue'
import VideoPlayer from './components/VideoPlayer.vue'

const movies = ref([])
const currentView = ref('all')
const selectedFolder = ref(null)
const isLoading = ref(false)
const selectedMovie = ref(null)
const showMovieDetail = ref(false)
const playingMovie = ref(null)
const sidebarVisible = ref(true)

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}

const selectFolder = async () => {
  isLoading.value = true
  try {
    const result = await window.api.selectFolder()
    if (result.success) {
      selectedFolder.value = result.path
      movies.value = result.movies
    }
  } catch (error) {
    console.error('Error selecting folder:', error)
  } finally {
    isLoading.value = false
  }
}

const changeView = (view) => {
  currentView.value = view
}

const openMovieDetail = (movie) => {
  selectedMovie.value = movie
  showMovieDetail.value = true
}

const closeMovieDetail = () => {
  showMovieDetail.value = false
  selectedMovie.value = null
}

const playMovie = (movie) => {
  playingMovie.value = movie
  closeMovieDetail()
}

const closePlayer = () => {
  playingMovie.value = null
}

onMounted(() => {
  // Load saved movies from storage if available
})
</script>

<template>
  <div class="flex h-screen bg-gradient-to-br from-zinc-950 via-black to-zinc-950 text-white">
    <!-- Sidebar -->
    <Transition name="sidebar">
      <Sidebar 
        v-if="sidebarVisible"
        :selected-folder="selectedFolder"
        :current-view="currentView"
        @select-folder="selectFolder"
        @change-view="changeView"
      />
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="relative bg-gradient-to-b from-black/90 to-transparent backdrop-blur-xl border-b border-white/5 px-8 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button 
              @click="toggleSidebar"
              class="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 transition-all"
              :title="sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
            <div>
              <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">My Collection</h1>
              <p class="text-sm text-zinc-500 mt-1.5 font-medium">
                {{ movies.length }} {{ movies.length === 1 ? 'movie' : 'movies' }}
                <span v-if="selectedFolder" class="text-zinc-600 ml-1">• {{ selectedFolder.split('\\').pop() }}</span>
              </p>
            </div>
          </div>
          
          <div class="flex items-center gap-3">
            <div class="relative">
              <input 
                type="text" 
                placeholder="Search your library..." 
                class="bg-white/5 border border-white/10 rounded-xl px-5 py-2.5 w-96 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:bg-white/10 transition-all placeholder:text-zinc-600 text-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button 
              @click="selectFolder"
              class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/30 font-medium text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              Scan Folder
            </button>
          </div>
        </div>
      </header>

      <!-- Movies Grid -->
      <div class="flex-1 overflow-y-auto">
        <MovieGrid 
          :movies="movies" 
          :is-loading="isLoading"
          @movie-click="openMovieDetail"
        />
      </div>
    </main>

    <!-- Movie Detail Modal -->
    <MovieDetailModal 
      v-if="showMovieDetail && selectedMovie"
      :movie="selectedMovie"
      @close="closeMovieDetail"
      @play="playMovie"
    />

    <!-- Video Player -->
    <VideoPlayer 
      v-if="playingMovie"
      :movie="playingMovie"
      @close="closePlayer"
    />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  overflow: hidden;
}

.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
</style>
