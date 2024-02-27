<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ on }">
      <v-badge
          color="red"
          :content="unreadNotifications"
          offset-y="24" offset-x="24"
      >
        <v-btn v-on="on" icon><v-icon>mdi-bell</v-icon></v-btn>
      </v-badge>
    </template>
    <v-card width="400" color="white">
      <v-card-title>
        <span>Notifications</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="menu = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-subtitle class="grey--text">{{ unreadNotifications }} unread notifications</v-card-subtitle>
      <v-card-text style="max-height: 500px; overflow-y: auto">
        <user-notifications />
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapGetters } from "vuex";
import UserNotifications from "@/domain/User/Widgets/UserNotifications.vue";

export default {
  name: "HeaderNotifications",
  components: {UserNotifications},
  data() {
    return {
      menu: false
    }
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