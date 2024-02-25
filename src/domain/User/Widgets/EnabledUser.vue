<template>
  <section>
      <div v-if="!accountEnabled" class="text-center py-5">
        <v-icon size="60" color="grey">mdi-account-cancel</v-icon>
        <h3>Account Not Enabled</h3>
        <small class="grey--text">Your account is currently {{ profile.status }}, kindly contact the admin</small>
      </div>
      <slot v-else />
  </section>
</template>

<script>
import current_user from "@/domain/User/Mixins/current_user";
export default {
  name: "EnabledUser",
  mixins: [current_user],
  computed: {
    accountEnabled() {
      return this.profile.status === 'enabled';
    }
  }
}
</script>