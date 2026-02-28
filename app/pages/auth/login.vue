<script setup lang="ts">
const router = useRouter();
const toast = useToast();
const email = ref('');
const password = ref('');
const loading = ref(false);

const handleLogin = async () => {
  loading.value = true;
  try {
    const res = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email: email.value, password: password.value }
    });
    
    if (res.success) {
      toast.add({ title: 'Welcome back!', color: 'green' });
      router.push('/');
    } else {
      toast.add({ title: 'Login failed', description: res.msg, color: 'red' });
    }
  } catch (e: any) {
    toast.add({ title: 'Error', description: e.message || "An unexpected error occurred", color: 'red' });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
        Or
        <NuxtLink to="/auth/register" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
          create a new account
        </NuxtLink>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <UCard class="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleLogin">
          <UFormGroup label="Email address" name="email" required>
            <UInput v-model="email" type="email" icon="i-heroicons-envelope" placeholder="you@example.com" />
          </UFormGroup>

          <UFormGroup label="Password" name="password" required>
            <UInput v-model="password" type="password" icon="i-heroicons-lock-closed" placeholder="••••••••" />
          </UFormGroup>

          <div class="flex items-center justify-between">
            <UCheckbox label="Remember me" name="remember-me" />
            <div class="text-sm">
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <UButton 
              type="submit" 
              block 
              :loading="loading"
              icon="i-heroicons-arrow-right-on-rectangle"
            >
              Sign in
            </UButton>
          </div>
        </form>
      </UCard>
    </div>
  </div>
</template>
