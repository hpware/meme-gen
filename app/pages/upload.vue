<script setup lang="ts">
const user = useCookie('auth_session');
const router = useRouter();

if (!user.value) {
    router.push('/auth/login');
}

const { $trpc } = useNuxtApp();

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isLoading = ref(false);
const errorMsg = ref('');

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            previewUrl.value = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
};

const upload = async () => {
    if (!previewUrl.value) return;
    
    isLoading.value = true;
    errorMsg.value = '';

    try {
        await $trpc.uploadImage.mutate({
            image: previewUrl.value
        });
        router.push('/');
    } catch (e: any) {
        console.error(e);
        errorMsg.value = e.message || "Failed to upload";
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">Upload Meme</h1>
        
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border dark:border-gray-700">
            <div class="mb-4">
                <label class="block mb-2 font-semibold">Select Image</label>
                <input 
                    type="file" 
                    accept="image/*" 
                    @change="handleFileChange" 
                    ref="fileInput"
                    class="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
            </div>

            <div v-if="previewUrl" class="mb-4">
                <p class="mb-2 font-semibold">Preview:</p>
                <img :src="previewUrl" alt="Preview" class="max-h-96 rounded border dark:border-gray-600" />
            </div>

            <div v-if="errorMsg" class="mb-4 text-red-500">
                {{ errorMsg }}
            </div>

            <button 
                @click="upload" 
                :disabled="!previewUrl || isLoading"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {{ isLoading ? 'Uploading & Analyzing...' : 'Upload Meme' }}
            </button>
        </div>
    </div>
</template>
