<script setup lang="ts">
const user = useCookie('auth_session');
const router = useRouter();
const colorMode = useColorMode();

const logout = () => {
  const cookie = useCookie('auth_session');
  cookie.value = null;
  router.push('/auth/login');
}

const toggleColorMode = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
}
</script>

<template>
  <div class="min-h-screen flex flex-col transition-colors duration-300 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <UContainer>
        <div class="flex items-center justify-between h-16">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <UIcon name="i-heroicons-sparkles" class="w-8 h-8 text-primary-500 group-hover:animate-pulse" />
            <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-600 dark:from-primary-400 dark:to-purple-400">
              MemeGen
            </span>
          </NuxtLink>
          
          <nav class="flex items-center gap-4">
            <UButton to="/" variant="ghost" color="gray" icon="i-heroicons-home" label="Home" class="hidden sm:flex" />
            <UButton 
              v-if="user" 
              to="/upload" 
              color="primary" 
              variant="solid" 
              icon="i-heroicons-arrow-up-tray" 
              label="Upload"
            />
            
            <div class="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

            <div v-if="!user" class="flex gap-2">
              <UButton to="/auth/login" variant="ghost" color="gray" label="Login" />
              <UButton to="/auth/register" color="gray" variant="soft" label="Register" />
            </div>
            
            <UDropdown v-else :items="[[{ label: 'Profile', icon: 'i-heroicons-user' }, { label: 'Settings', icon: 'i-heroicons-cog-6-tooth' }], [{ label: 'Logout', icon: 'i-heroicons-arrow-right-on-rectangle', click: logout }]]">
               <UAvatar alt="User" size="sm" class="cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all" />
            </UDropdown>

            <UButton 
              color="gray" 
              variant="ghost" 
              :icon="colorMode.value === 'dark' ? 'i-heroicons-moon' : 'i-heroicons-sun'" 
              @click="toggleColorMode" 
              aria-label="Toggle dark mode"
            />
          </nav>
        </div>
      </UContainer>
    </header>

    <main class="flex-grow py-8">
      <UContainer>
        <slot />
      </UContainer>
    </main>

    <footer class="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-8 mt-auto">
      <UContainer class="text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Powered by <span class="font-bold text-primary-500">Gemini CLI</span> & <span class="font-bold text-purple-500">OpenRouter</span>
        </p>
        <p class="text-xs text-gray-400 mt-2">
          &copy; {{ new Date().getFullYear() }} MemeGen. All memes belong to their respective creators.
        </p>
      </UContainer>
    </footer>
    <UNotifications />
  </div>
</template>
