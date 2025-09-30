<script setup lang="ts">
const { $trpc } = useNuxtApp();
const trpcImageData = ref((await $trpc.getNewImages.useQuery({})).data);

const updateTRPCIMAGEDATA = async () => {
    const { data: trpcImageDataNew } = await $trpc.getNewImages.useQuery({});
    trpcImageData.value = trpcImageDataNew;
}
</script>
<template>
    <div>
        <span class="text-2xl">迷因生成器 {{ trpcImageData }}</span>
        <button class="rounded bg-blue-600 p-2 hover:bg-blue-600/70 transition-all duration-300 text-white cursor-pointer" @click="updateTRPCIMAGEDATA">Generate!!</button>
        <img :src="trpcImageData.image" :alt="trpcImageData.ai_text_explain" />
        <span>{{ trpcImageData.ai_text_explain }}</span>
    </div>
</template>
