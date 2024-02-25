<template>
    <v-badge
        v-if="provider"
        bordered
        bottom
        color="primary"
        :offset-x="sizeRatio.editBadgeOffset"
        :offset-y="sizeRatio.editBadgeOffset"
        icon="mdi-google"
        class="white--text"
    >
      <profile-avatar
          :size="size"
          :profile="{ first_name: provider.displayName, image: provider.photoURL }"
          style="cursor: pointer"
          :title="`Connected to Google account as ${provider.displayName}`"
          @click="$emit('disconnect')"
      ></profile-avatar>
    </v-badge>
    <v-badge
        v-else
        bordered
        bottom
        color="primary"
        :offset-x="sizeRatio.editBadgeOffset"
        :offset-y="sizeRatio.editBadgeOffset"
        icon="mdi-plus"
        class="white--text"
    >
      <profile-avatar
          :size="size"
          style="cursor: pointer"
          title="Connect Google"
          color="primary"
          @click="$emit('connect')"
      >
        <template #icon>
          <v-icon class="white--text" :size="Math.ceil(size/2)">mdi-google</v-icon>
        </template>
      </profile-avatar>
    </v-badge>
</template>
<script>
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "GoogleConnectBadge",
  components: { ProfileAvatar},
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