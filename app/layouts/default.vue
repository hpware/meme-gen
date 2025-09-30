<template>
    <span class="text-2xl">迷因生成器 bun</span>
    <main class="min-h-screen">
        <slot></slot>
    </main>
    <footer class="justify-center text-center flex flex-col">
        <span>Made using Bun, TailwindCSS, Nuxt, Vue, and tRPC</span>
        <span>&copy; {{ new Date().toUTCYear() }} yh!</span>
    </footer>
</template>
