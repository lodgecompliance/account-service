<template>
  <section>
      <div v-if="!accountEnabled" class="text-center py-5">
        <v-icon size="60" color="grey">mdi-account-cancel</v-icon>
        <h3>Business Not Enabled</h3>
        <small class="grey--text">The business is currently {{ currentBusiness.status }}, kindly contact the admin</small>
      </div>
      <slot v-else />
  </section>
</template>

<script>
import current_business from "@/domain/Business/Mixins/current_business";
export default {
  name: "EnabledBusiness",
  mixins: [current_business],
  computed: {
    accountEnabled() {
      return this.currentBusiness.status === 'enabled';
    }
  }
}
</script>