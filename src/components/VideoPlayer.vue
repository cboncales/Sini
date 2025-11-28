<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const videoRef = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const showControls = ref(true)
const isFullscreen = ref(false)
let controlsTimeout = null

const togglePlay = () => {
  if (videoRef.value) {
    if (isPlaying.value) {
      videoRef.value.pause()
    } else {
      videoRef.value.play()
    }
  }
}

const handleTimeUpdate = () => {
  if (videoRef.value) {
    currentTime.value = videoRef.value.currentTime
  }
}

const handleLoadedMetadata = () => {
  if (videoRef.value) {
    duration.value = videoRef.value.duration
  }
}

const handlePlay = () => {
  isPlaying.value = true
}

const handlePause = () => {
  isPlaying.value = false
}

const seek = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  if (videoRef.value) {
    videoRef.value.currentTime = pos * duration.value
  }
}

const toggleMute = () => {
  if (videoRef.value) {
    isMuted.value = !isMuted.value
    videoRef.value.muted = isMuted.value
  }
}

const changeVolume = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const pos = (event.clientX - rect.left) / rect.width
  volume.value = Math.max(0, Math.min(1, pos))
  if (videoRef.value) {
    videoRef.value.volume = volume.value
    if (volume.value > 0) {
      isMuted.value = false
      videoRef.value.muted = false
    }
  }
}

const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const handleClose = () => {
  if (videoRef.value) {
    videoRef.value.pause()
  }
  emit('close')
}

const handleMouseMove = () => {
  showControls.value = true
  clearTimeout(controlsTimeout)
  controlsTimeout = setTimeout(() => {
    if (isPlaying.value) {
      showControls.value = false
    }
  }, 3000)
}

const skip = (seconds) => {
  if (videoRef.value) {
    videoRef.value.currentTime += seconds
  }
}

const toggleFullscreen = () => {
  const container = videoRef.value?.parentElement
  if (!document.fullscreenElement) {
    container?.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  clearTimeout(controlsTimeout)
})
</script>

<template>
  <div class="fixed inset-0 z-50 bg-black flex flex-col">
    <!-- Video Container -->
    <div class="relative flex-1 flex items-center justify-center bg-black">
      <video
        ref="videoRef"
        :src="`file://${movie.path}`"
        class="max-w-full max-h-full"
        @timeupdate="handleTimeUpdate"
        @loadedmetadata="handleLoadedMetadata"
        @play="handlePlay"
        @pause="handlePause"
        @click="togglePlay"
      ></video>

      <!-- Controls Overlay -->
      <div 
        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity"
        :class="showControls ? 'opacity-100' : 'opacity-0'"
      >
        <!-- Top Bar -->
        <div class="absolute top-0 left-0 right-0 p-6 flex items-center justify-between">
          <div>
            <h3 class="text-xl font-semibold">{{ movie.title }}</h3>
            <p class="text-sm text-zinc-400">{{ movie.filename }}</p>
          </div>
          <button 
            @click="handleClose"
            class="bg-zinc-800/80 hover:bg-zinc-700 rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Center Play Button (when paused) -->
        <div 
          v-if="!isPlaying"
          class="absolute inset-0 flex items-center justify-center"
        >
          <button 
            @click="togglePlay"
            class="bg-red-600 hover:bg-red-700 rounded-full p-6 transition-all hover:scale-110"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!-- Bottom Controls -->
        <div class="absolute bottom-0 left-0 right-0 p-6">
          <!-- Progress Bar -->
          <div class="mb-4">
            <div 
              @click="seek"
              class="w-full h-1 bg-zinc-700 rounded-full cursor-pointer hover:h-2 transition-all"
            >
              <div 
                class="h-full bg-red-600 rounded-full relative"
                :style="{ width: `${(currentTime / duration) * 100}%` }"
              >
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div class="flex justify-between text-xs text-zinc-400 mt-1">
              <span>{{ formatTime(currentTime) }}</span>
              <span>{{ formatTime(duration) }}</span>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <!-- Play/Pause -->
              <button 
                @click="togglePlay"
                class="hover:text-red-500 transition-colors"
              >
                <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>

              <!-- Skip Back -->
              <button 
                @click="skip(-10)"
                class="hover:text-red-500 transition-colors"
                title="Rewind 10s"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              <!-- Skip Forward -->
              <button 
                @click="skip(10)"
                class="hover:text-red-500 transition-colors"
                title="Forward 10s"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>

              <!-- Volume -->
              <div class="flex items-center gap-2">
                <button 
                  @click="toggleMute"
                  class="hover:text-red-500 transition-colors"
                >
                  <svg v-if="isMuted || volume === 0" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                  </svg>
                </button>
                <div 
                  @click="changeVolume"
                  class="w-20 h-1 bg-zinc-700 rounded-full cursor-pointer"
                >
                  <div 
                    class="h-full bg-white rounded-full"
                    :style="{ width: `${volume * 100}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Right Controls -->
            <div class="flex items-center gap-4">
              <button 
                @click="toggleFullscreen"
                class="hover:text-red-500 transition-colors"
              >
                <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
