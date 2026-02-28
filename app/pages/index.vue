<script setup lang="ts">
const { $trpc } = useNuxtApp();
const { data: memes, refresh, pending } = await $trpc.getMemes.useQuery();

// Adding a subtle polling mechanism or refresh button
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span class="block xl:inline">Fresh</span>
          <span class="block text-primary-600 dark:text-primary-400 xl:inline"> Memes</span>
        </h1>
        <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
          Curated by AI, enjoyed by humans.
        </p>
      </div>
      <UButton 
        icon="i-heroicons-arrow-path" 
        size="lg" 
        variant="soft" 
        :loading="pending" 
        @click="refresh()"
      >
        Refresh Feed
      </UButton>
    </div>

    <div v-if="pending && !memes" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
       <USkeleton v-for="n in 6" :key="n" class="h-64 w-full rounded-xl" />
    </div>

    <div v-else-if="memes?.length === 0" class="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
      <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400 mb-4" />
      <h3 class="text-xl font-medium text-gray-900 dark:text-white">No memes found</h3>
      <p class="mt-1 text-gray-500">Get started by creating a new meme.</p>
      <div class="mt-6">
        <UButton to="/upload" size="lg" icon="i-heroicons-plus">Upload Meme</UButton>
      </div>
    </div>

    <div v-else class="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
      <UCard 
        v-for="meme in memes" 
        :key="meme.uuid" 
        class="break-inside-avoid hover:ring-2 hover:ring-primary-500 hover:shadow-lg transition-all duration-300 dark:bg-gray-800/80 backdrop-blur-sm"
        :ui="{ body: { padding: 'p-0' }, footer: { padding: 'p-4' } }"
      >
        <div class="relative group overflow-hidden">
          <img 
            :src="meme.memeImage" 
            :alt="meme.aiGeneratedDescription" 
            class="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500" 
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
             <UBadge color="white" variant="solid" class="text-black shadow-lg">AI Generated</UBadge>
          </div>
        </div>
        
        <template #footer>
          <div class="space-y-3">
             <p class="text-sm font-medium text-gray-800 dark:text-gray-200 leading-relaxed italic">
               "{{ meme.aiGeneratedDescription }}"
             </p>
             <div class="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
               <span class="flex items-center gap-1">
                 <UIcon name="i-heroicons-calendar" class="w-3 h-3" />
                 {{ new Date(meme.uploaded_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) }}
               </span>
               <span class="flex items-center gap-1">
                  <UIcon name="i-heroicons-user" class="w-3 h-3" />
                  Unknown User
               </span>
             </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>
