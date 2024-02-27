<template>
    <div
        class="d-flex flex-nowrap align-center"
        @mouseenter="selectable = true"
        @mouseleave="selectable = false"
    >
        <v-checkbox
            v-if="selected || selectable"
            v-model="selected"
        ></v-checkbox>
        <v-list-item
            :class="`${notification.read ? 'transparent' : 'white'}`"
            @click="dialog = true"
            three-line>
          <v-list-item-avatar :class="`${$vuetify.breakpoint.mobile ? 'ml-n4' : ''}`">
            <v-avatar>
              <v-icon v-if="notification.read">mdi-bell</v-icon>
              <v-icon v-else color="primary">mdi-bell-badge</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content :class="`${$vuetify.breakpoint.mobile ? 'ml-n4' : ''}`">
            <v-list-item-title>{{ notification.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ notification.text }}</v-list-item-subtitle>
            <v-list-item-subtitle>
              <small class="grey--text">{{ notification.time }}</small>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu>
              <template #activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item v-if="!notification.read" @click="markAsRead">
                  <v-list-item-content>
                    <v-list-item-title>Mark as read</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click="selected = !selected">
                  <v-list-item-content>
                    <v-list-item-title>{{ selected ? 'Unselect' : 'Select' }} Notification</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      <v-dialog v-model="dialog" width="400">
        <component
            :is="notificationComponents[notification.type] ? notificationComponents[notification.type] : 'user-notification-details'"
            :notification="notification"
            @close="dialog = false"
            v-on="$listeners"
        >
        </component>
      </v-dialog>
    </div>
</template>

<script>
  import DataContainer from "@/components/DataContainer.vue";
  import UserNotificationDetails from "@/domain/User/Components/UserNotificationDetails.vue";

  export default {
      name: "UserNotification",
      components: { UserNotificationDetails, DataContainer },
      data(){
          return {
            error: null,
            dialog: false,
            loading: false,
            selected: false,
            selectable: false,
            notificationComponents: {}
          }
      },
      props: {
          notification: Object,
          select: Boolean,
      },
      computed: {},
      methods: {
        markAsRead() {
          this.$emit('mark-as-read', this.notification);
        }
      },
    watch: {
      selected: {
        immediate: true,
        handler(s) {
          if(s) this.$emit('selected', this.notification.id)
          else this.$emit('unselected', this.notification.id)
        }
      },
      select: {
        immediate: true,
        handler(s) {
          this.selected = s;
        }
      }
    }
  }
</script>