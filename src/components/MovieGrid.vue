<script setup>
import { ref } from 'vue'
import MovieCard from './MovieCard.vue'

const props = defineProps({
  movies: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['movie-click'])

const handleMovieClick = (movie) => {
  emit('movie-click', movie)
}
</script>

<template>
  <div class="p-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-20">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
        <p class="text-zinc-400">Scanning for movies...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="movies.length === 0" class="flex items-center justify-center py-20">
      <div class="text-center max-w-lg">
        <div class="bg-gradient-to-br from-zinc-900 to-black rounded-3xl p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center border border-white/10 shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 class="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">No Movies Yet</h3>
        <p class="text-zinc-500 mb-8 text-lg leading-relaxed">
          Click "Scan Folder" to select a folder containing your movie files and start building your collection.
        </p>
        <div class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-left text-sm text-zinc-400">
          <p class="font-bold text-zinc-300 mb-3 text-base">Supported formats:</p>
          <p class="leading-relaxed">MP4, MKV, AVI, MOV, WMV, FLV, WEBM, M4V, MPG, MPEG</p>
        </div>
      </div>
    </div>

    <!-- Movies Grid -->
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      <MovieCard 
        v-for="movie in movies" 
        :key="movie.id || movie.path"
        :movie="movie"
        @click="handleMovieClick"
      />
    </div>
  </div>
</template>
