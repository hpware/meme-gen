<script lang="ts" setup>
const error = useError();
</script>
<template>
    <NuxtLayout>
        <div
            class="flex flex-col justify-center absolute inset-0 text-center h-screen items-center"
        >
            <img
                src="/assets/catpizzaitalian.png"
                class="w-fit h-fit max-w-[300px] text-center justify-center items-center"
            />
            <span class="text-lg"
                >這好像是 Pizza + 鳳梨？？ 你在
                {{ error.statusCode }} 嗎？？</span
            >
            <span>{{ error.message }}</span>
        </div>
        <div class="min-h-screen"></div>
    </NuxtLayout>
</template>
