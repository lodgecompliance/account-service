<template>
    <smart-camera-web capture-id>
    </smart-camera-web>
</template>

<script>
import '@smile_identity/smart-camera-web';
export default {
    name: "SmileID",
    
    mounted() {
        const app = document.querySelector('smart-camera-web');
        app.addEventListener('imagesComputed', async (e) => {
            this.$emit('computed-images', e.detail);
        });
    }
}
</script>