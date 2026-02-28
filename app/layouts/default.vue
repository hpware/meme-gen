<script setup lang="ts">
const user = useCookie('auth_session');
const router = useRouter();

const logout = () => {
  const cookie = useCookie('auth_session');
  cookie.value = null;
  router.push('/auth/login');
}
</script>

<template>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
        <header class="bg-white dark:bg-gray-800 shadow p-4 flex justify-between items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-blue-600">迷因生成器 (MemeGen)</NuxtLink>
            <nav class="flex gap-4">
                <NuxtLink to="/" class="hover:text-blue-500">Home</NuxtLink>
                <NuxtLink v-if="user" to="/upload" class="hover:text-blue-500">Upload</NuxtLink>
                <div v-if="!user" class="flex gap-4">
                    <NuxtLink to="/auth/login" class="hover:text-blue-500">Login</NuxtLink>
                    <NuxtLink to="/auth/register" class="hover:text-blue-500">Register</NuxtLink>
                </div>
                <button v-else @click="logout" class="hover:text-red-500">Logout</button>
            </nav>
        </header>

        <main class="flex-grow container mx-auto p-4">
            <slot></slot>
        </main>

        <footer class="bg-white dark:bg-gray-800 p-4 text-center mt-auto border-t dark:border-gray-700">
            <span class="block">Made using Bun, TailwindCSS, Nuxt, Vue, and tRPC</span>
            <span class="block text-sm text-gray-500">&copy; {{ new Date().getUTCFullYear() }} hpware</span>
        </footer>
    </div>
</template>
