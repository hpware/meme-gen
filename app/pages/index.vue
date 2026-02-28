<script setup lang="ts">
const { $trpc } = useNuxtApp();
const { data: memes, refresh } = await $trpc.getMemes.useQuery();

// Auto refresh or just rely on initial load
</script>

<template>
    <div>
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-3xl font-bold">Latest Memes</h1>
            <button @click="refresh()" class="text-sm bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:opacity-80">Refresh</button>
        </div>

        <div v-if="memes?.length === 0" class="text-center py-10">
            <p class="text-xl text-gray-500">No memes yet. Be the first to upload!</p>
            <NuxtLink to="/upload" class="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">Upload Meme</NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="meme in memes" :key="meme.uuid" class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden border dark:border-gray-700">
                <img :src="meme.memeImage" :alt="meme.aiGeneratedDescription" class="w-full h-64 object-cover" />
                <div class="p-4">
                    <p class="text-gray-700 dark:text-gray-300 text-sm">{{ meme.aiGeneratedDescription }}</p>
                    <div class="mt-2 text-xs text-gray-500 flex justify-between">
                         <span>Uploaded: {{ new Date(meme.uploaded_at).toLocaleDateString() }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
