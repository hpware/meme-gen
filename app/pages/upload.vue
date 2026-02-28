<script setup lang="ts">
const user = useCookie('auth_session');
const router = useRouter();

if (!user.value) {
    router.push('/auth/login');
}

const { $trpc } = useNuxtApp();
const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const isLoading = ref(false);
const isDragging = ref(false);

const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        processFile(target.files[0]);
    }
};

const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
        processFile(event.dataTransfer.files[0]);
    }
};

const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        toast.add({ title: 'Invalid file type', description: 'Please upload an image file.', color: 'red' });
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
};

const clearImage = () => {
    previewUrl.value = null;
    if (fileInput.value) fileInput.value.value = '';
}

const upload = async () => {
    if (!previewUrl.value) return;
    
    isLoading.value = true;
    try {
        await $trpc.uploadImage.mutate({
            image: previewUrl.value
        });
        toast.add({ title: 'Success!', description: 'Meme uploaded and analyzed.', color: 'green' });
        router.push('/');
    } catch (e: any) {
        console.error(e);
        toast.add({ title: 'Upload Failed', description: e.message || "Something went wrong.", color: 'red' });
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="max-w-2xl mx-auto py-10">
        <div class="text-center mb-10">
            <h1 class="text-3xl font-bold mb-2">Upload a Meme</h1>
            <p class="text-gray-500 dark:text-gray-400">Share your humor with the world (and our AI).</p>
        </div>
        
        <UCard :ui="{ body: { padding: 'p-0' } }" class="overflow-hidden">
            <div 
                class="relative border-2 border-dashed transition-all duration-300 min-h-[400px] flex flex-col items-center justify-center p-8"
                :class="[
                    isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10' : 'border-gray-300 dark:border-gray-700',
                    previewUrl ? 'bg-black/5 dark:bg-black/20' : ''
                ]"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
            >
                <input 
                    type="file" 
                    accept="image/*" 
                    @change="handleFileChange" 
                    ref="fileInput"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    :disabled="isLoading"
                />

                <div v-if="previewUrl" class="relative w-full h-full flex items-center justify-center">
                    <img :src="previewUrl" alt="Preview" class="max-h-[500px] w-auto rounded shadow-lg object-contain" />
                    <UButton 
                        color="red" 
                        variant="soft" 
                        icon="i-heroicons-trash" 
                        class="absolute top-4 right-4 z-20"
                        @click.stop.prevent="clearImage"
                    />
                </div>

                <div v-else class="text-center pointer-events-none">
                    <div class="bg-primary-100 dark:bg-primary-900/30 p-4 rounded-full inline-block mb-4">
                        <UIcon name="i-heroicons-cloud-arrow-up" class="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">Click or drag image here</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-4">
                    <UButton to="/" color="gray" variant="ghost">Cancel</UButton>
                    <UButton 
                        @click="upload" 
                        :loading="isLoading" 
                        :disabled="!previewUrl" 
                        color="primary" 
                        size="lg"
                        icon="i-heroicons-paper-airplane"
                    >
                        {{ isLoading ? 'Analyzing...' : 'Upload Meme' }}
                    </UButton>
                </div>
            </template>
        </UCard>
    </div>
</template>
