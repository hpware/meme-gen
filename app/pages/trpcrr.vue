<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data: hello } = await $trpc.hello.useQuery({ text: "world" });
const submitMeme = async () => {
    //await $trpc.uploadImage.useMutation({});
};
</script>

<template>
    <div>{{ hello?.greeting }}</div>
    <div><button @click="submitMeme">SUBMIT YOUR MEME!</button></div>
</template>
