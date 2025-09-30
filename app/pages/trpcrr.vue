<script setup lang="ts">
const { $trpc } = useNuxtApp();

const { data: hello } = await $trpc.hello.useQuery({ text: "sfsdfsd" });
</script>

<template>
    <div>{{ hello?.greeting }}</div>
</template>
