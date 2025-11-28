<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'play'])

const fileSize = computed(() => {
  if (!props.movie.size) return ''
  const gb = props.movie.size / (1024 ** 3)
  return gb.toFixed(2) + ' GB'
})

const formatDuration = (minutes) => {
  if (!minutes) return 'Unknown'
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const handleClose = () => {
  emit('close')
}

const handlePlay = () => {
  emit('play', props.movie)
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl" @click="handleClose">
    <div class="relative w-full max-w-6xl mx-4 bg-gradient-to-b from-zinc-900 to-black rounded-3xl shadow-2xl overflow-hidden border border-white/10" @click.stop>
      <!-- Close Button -->
      <button 
        @click="handleClose"
        class="absolute top-6 right-6 z-10 bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-3 transition-all border border-white/10 hover:scale-110"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Backdrop Image -->
      <div class="relative h-80 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <img 
          v-if="movie.backdrop || movie.poster"
          :src="movie.backdrop || movie.poster" 
          :alt="movie.title"
          class="w-full h-full object-cover opacity-40"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
      </div>

      <!-- Content -->
      <div class="relative -mt-40 px-8 pb-8">
        <div class="flex gap-6">
          <!-- Poster -->
          <div class="flex-shrink-0 w-48">
            <div class="aspect-[2/3] bg-zinc-800 rounded-lg overflow-hidden shadow-2xl">
              <img 
                v-if="movie.poster"
                :src="movie.poster" 
                :alt="movie.title"
                class="w-full h-full object-cover"
              />
              <div 
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-700 to-zinc-800"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Details -->
          <div class="flex-1">
            <h2 class="text-4xl font-bold mb-2">{{ movie.title }}</h2>
            
            <!-- Meta Info -->
            <div class="flex items-center gap-4 text-sm text-zinc-400 mb-4">
              <span v-if="movie.year" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                {{ movie.year }}
              </span>
              <span v-if="movie.duration" class="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                {{ formatDuration(movie.duration) }}
              </span>
              <span v-if="movie.quality" class="px-2 py-1 bg-zinc-800 rounded text-xs font-semibold">
                {{ movie.quality }}
              </span>
            </div>

            <!-- Genres -->
            <div v-if="movie.genres && movie.genres.length" class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="genre in movie.genres" 
                :key="genre"
                class="px-3 py-1 bg-zinc-800 rounded-full text-sm"
              >
                {{ genre }}
              </span>
            </div>

            <!-- Description -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-2">Overview</h3>
              <p class="text-zinc-300 leading-relaxed">
                {{ movie.description || 'No description available for this movie.' }}
              </p>
            </div>

            <!-- Play Button -->
            <button 
              @click="handlePlay"
              class="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-3 transition-all shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
              Play Movie
            </button>

            <!-- Additional Info -->
            <div class="mt-8 grid grid-cols-2 gap-6 text-sm">
              <div class="flex flex-col gap-1">
                <span class="text-zinc-600 text-xs uppercase tracking-wider font-semibold">File Size</span>
                <span class="text-zinc-300 font-medium">{{ fileSize }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-zinc-600 text-xs uppercase tracking-wider font-semibold">Format</span>
                <span class="text-zinc-300 font-medium">{{ movie.ext || 'N/A' }}</span>
              </div>
              <div v-if="movie.resolution" class="flex flex-col gap-1">
                <span class="text-zinc-600 text-xs uppercase tracking-wider font-semibold">Resolution</span>
                <span class="text-zinc-300 font-medium">{{ movie.resolution }}</span>
              </div>
              <div v-if="movie.codec" class="flex flex-col gap-1">
                <span class="text-zinc-600 text-xs uppercase tracking-wider font-semibold">Codec</span>
                <span class="text-zinc-300 font-medium">{{ movie.codec }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
