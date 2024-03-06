<template>
  <v-badge
      color="red"
      :content="unreadNotifications"
      offset-y="24" offset-x="24"
  >
    <v-btn :to="{ name: 'user.notifications' }" icon><v-icon>mdi-bell</v-icon></v-btn>
  </v-badge>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "HeaderNotifications",
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters([ 'user_notifications' ]),

    unreadNotifications() {
      return this.user_notifications.filter(n => !n.read).length
    }
  },
}
</script>

<style>
.theme--dark.v-badge .v-badge__badge::after {
  border-color: #FFFFFF !important;
}
</style>