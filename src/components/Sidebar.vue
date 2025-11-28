<script setup>
import { ref } from 'vue'

const props = defineProps({
  selectedFolder: String,
  currentView: {
    type: String,
    default: 'all'
  }
})

const emit = defineEmits(['select-folder', 'change-view'])

const menuItems = [
  { id: 'all', label: 'All Movies', icon: 'collection' },
  { id: 'recent', label: 'Recently Added', icon: 'clock' },
  { id: 'favorites', label: 'Favorites', icon: 'star' }
]

const handleSelectFolder = () => {
  emit('select-folder')
}

const handleChangeView = (view) => {
  emit('change-view', view)
}
</script>

<template>
  <aside class="w-72 bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col">
    <!-- Logo/Brand -->
    <div class="p-8 border-b border-white/10">
      <div class="flex items-center gap-3">
        <div class="bg-gradient-to-br from-red-600 via-red-500 to-rose-600 rounded-2xl p-3 shadow-lg shadow-red-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <div>
          <h2 class="font-bold text-lg">Sini</h2>
          <p class="text-xs text-zinc-400">Movie Library</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-6">
      <div class="space-y-2">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="handleChangeView(item.id)"
          class="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all font-medium text-sm"
          :class="currentView === item.id 
            ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/20' 
            : 'text-zinc-400 hover:bg-white/5 hover:text-white'"
        >
          <!-- Collection Icon -->
          <svg v-if="item.icon === 'collection'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          
          <!-- Clock Icon -->
          <svg v-if="item.icon === 'clock'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
          </svg>
          
          <!-- Star Icon -->
          <svg v-if="item.icon === 'star'" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          
          <span class="font-medium">{{ item.label }}</span>
        </button>
      </div>

      <!-- Folder Selection -->
      <div class="mt-8 pt-6 border-t border-white/10">
        <h3 class="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">
          Library Location
        </h3>
        
        <div v-if="selectedFolder" class="px-4 py-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
          <div class="flex items-start gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-zinc-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            </svg>
            <p class="text-xs text-zinc-400 break-all leading-relaxed font-medium">
              {{ selectedFolder }}
            </p>
          </div>
        </div>

        <button 
          v-else
          @click="handleSelectFolder"
          class="w-full mt-2 px-4 py-3.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-medium border border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Folder
        </button>
      </div>
    </nav>

    <!-- Footer -->
    <div class="p-4 border-t border-zinc-700">
      <div class="flex items-center gap-3 px-4 py-2 text-xs text-zinc-400">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>v0.0.0</span>
      </div>
    </div>
  </aside>
</template>
