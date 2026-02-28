<script setup lang="ts">
const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  error.value = '';
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });
    
    if (res.success) {
      router.push('/');
    } else {
      error.value = res.msg || 'Login failed';
    }
  } catch (e: any) {
    error.value = e.data?.msg || e.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center min-h-[80vh]">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md border dark:border-gray-700">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Email</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium mb-1">Password</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div v-if="error" class="mb-4 text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
        
        <p class="mt-4 text-center text-sm">
          Don't have an account? <NuxtLink to="/auth/register" class="text-blue-500 hover:underline">Register</NuxtLink>
        </p>
      </form>
    </div>
  </div>
</template>
