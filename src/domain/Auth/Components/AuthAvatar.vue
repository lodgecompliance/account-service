<template>
  <profile-avatar :profile="profile" v-bind="$attrs" />
</template>

<script>
import auth from "@/mixins/auth";
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "AuthAvatar",
  mixins: [auth],
  components: {ProfileAvatar},
  computed: {
    profile() {
      return {
        ...this.current_user.profile,
        image: this.profileAvatar || this.googleAvatar
      }
    },
  }
}
</script>