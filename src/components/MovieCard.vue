<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const imageLoaded = ref(false)
const imageError = ref(false)

const posterUrl = computed(() => {
  if (props.movie.poster) {
    return props.movie.poster
  }
  return null
})

const fileSize = computed(() => {
  if (!props.movie.size) return ''
  const gb = props.movie.size / (1024 ** 3)
  return gb.toFixed(2) + ' GB'
})

const formatDuration = (minutes) => {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

const handleClick = () => {
  emit('click', props.movie)
}
</script>

<template>
  <div 
    @click="handleClick"
    class="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 cursor-pointer border border-white/5 hover:border-red-500/50"
  >
    <!-- Poster -->
    <div class="aspect-[2/3] bg-gradient-to-br from-zinc-800 to-zinc-900 relative overflow-hidden">
      <img 
        v-if="posterUrl && !imageError"
        :src="posterUrl" 
        :alt="movie.title"
        @load="imageLoaded = true"
        @error="imageError = true"
        class="w-full h-full object-cover transition-transform group-hover:scale-105"
        :class="{ 'opacity-0': !imageLoaded }"
      />
      
      <!-- Placeholder -->
      <div 
        v-if="!posterUrl || imageError"
        class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      </div>

      <!-- Loading Spinner -->
      <div 
        v-if="posterUrl && !imageLoaded && !imageError"
        class="absolute inset-0 flex items-center justify-center bg-zinc-800"
      >
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>

      <!-- Overlay on hover -->
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6">
        <button class="bg-gradient-to-r from-red-600 to-red-700 hover:scale-110 text-white rounded-full p-4 mb-4 transition-all shadow-2xl shadow-red-500/50">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <!-- Description Preview -->
        <p v-if="movie.description" class="text-sm text-center text-zinc-300 line-clamp-3 leading-relaxed">
          {{ movie.description }}
        </p>
      </div>

      <!-- Quality Badge -->
      <div v-if="movie.quality" class="absolute top-3 right-3 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg border border-white/10">
        {{ movie.quality }}
      </div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <h3 class="font-bold text-base line-clamp-2 mb-2.5 leading-tight" :title="movie.title">
        {{ movie.title }}
      </h3>
      
      <div class="flex items-center gap-2 text-xs text-zinc-500 mb-3 font-medium">
        <span v-if="movie.year">{{ movie.year }}</span>
        <span v-if="movie.year && movie.duration" class="text-zinc-700">•</span>
        <span v-if="movie.duration">{{ formatDuration(movie.duration) }}</span>
      </div>

      <!-- Genres -->
      <div v-if="movie.genres && movie.genres.length" class="flex flex-wrap gap-1.5 mb-3">
        <span 
          v-for="(genre, index) in movie.genres.slice(0, 3)" 
          :key="index"
          class="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full font-medium text-zinc-400"
        >
          {{ genre }}
        </span>
      </div>

      <div class="flex items-center justify-between text-xs text-zinc-600 font-medium">
        <span v-if="movie.size">{{ fileSize }}</span>
        <span v-if="movie.ext" class="bg-zinc-800/50 px-2 py-0.5 rounded">{{ movie.ext.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
