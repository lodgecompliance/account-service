<template>
    <smart-camera-web theme-color="#1976D2" hide-back-to-host capture-id>
    </smart-camera-web>
</template>

<script>

import "@smileid/web-components"
export default {
    name: "SmileID",

    data() {
      return {}
    },

    mounted() {
        const app = document.querySelector('smart-camera-web');
        app.addEventListener('smart-camera-web.publish', async (e) => {
            this.$emit('computed-images', e.detail);
        });

      app.addEventListener('smart-camera-web.cancelled', async (e) => {
        this.$emit('cancelled');
      });
    }
}
</script>