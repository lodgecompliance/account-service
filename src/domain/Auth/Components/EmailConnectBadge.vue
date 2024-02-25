<template>
    <v-badge
        v-if="provider"
        bordered
        bottom
        color="primary"
        :offset-x="sizeRatio.editBadgeOffset"
        :offset-y="sizeRatio.editBadgeOffset"
        icon="mdi-check"
        class="white--text"
    >
      <profile-avatar
          :size="size"
          color="primary"
          title="Email verified"
          @click="$emit('disconnect')"
      >
        <template #icon>
          <v-icon :size="Math.ceil(size/2)" class="white--text">mdi-phone </v-icon>
        </template>
      </profile-avatar>
    </v-badge>
    <v-badge
        v-else
        bordered
        bottom
        color="error"
        :offset-x="sizeRatio.editBadgeOffset"
        :offset-y="sizeRatio.editBadgeOffset"
        icon="mdi-close"
        class="white--text"
    >
      <profile-avatar
          :size="size"
          color="error"
          title="Email not verified"
          @click="$emit('connect')"
      >
        <template #icon>
          <v-icon :size="Math.ceil(size/2)" class="white--text">mdi-phone</v-icon>
        </template>
      </profile-avatar>
    </v-badge>
</template>
<script>
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "EmailConnectBadge",
  components: {ProfileAvatar},
  props: {
    provider: Object,
    size: {
      default: () => 40
    },
  },
  computed: {
    sizeRatio() {
      return {
        progressCircular: Math.ceil(this.size)/2,
        editBadgeOffset: Math.ceil(this.size)/4
      }
    },
  },
}
</script>