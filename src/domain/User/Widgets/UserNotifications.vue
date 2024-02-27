<template>
  <section>
    <div class="d-flex flex-nowrap align-center">
      <v-btn text color="primary" @click="selectAllItems" small>
        <span v-if="items.length && allSelected">
          <v-icon small>mdi-checkbox-blank</v-icon> unselect all
        </span>
        <span v-else>
          <v-icon small>mdi-checkbox-blank-outline</v-icon> select all
        </span>
      </v-btn>
      <v-btn
          color="primary"
          class="mx-1"
          :disabled="selected.length === 0"
          @click="markNotificationsAsRead(selected)" outlined small>
        <v-icon small>mdi-check</v-icon> Mark as read
      </v-btn>
      <v-btn
          color="primary"
          class="mx-1"
          @click="refreshUserNotifications" text small><v-icon>mdi-refresh</v-icon> Refresh
      </v-btn>
    </div>
    <data-container :loading="loading" :error="error" @retry="refreshUserNotifications">
        <template v-slot:loading>
            <v-skeleton-loader
                v-for="i in 6" :key=i
                type="card"
                height="50"
                class="my-2"
            ></v-skeleton-loader>
        </template>
        <template v-if="items.length">
            <user-notification
                v-for="notification in items"
                :notification="notification"
                :key="notification.id"
                :select="selected.includes(notification.id)"
                @update-notification="updateNotification"
                @mark-as-read="markNotificationsAsRead([notification.id])"
                @selected="selectItem"
                @unselected="unselectItem"
                class="my-2"
            />
        </template>
        <div v-else class="text-center py-16">
            <p class="grey--text text-center">You are all caught up, no notification here</p>
        </div>
    </data-container>
  </section>
</template>
<script>
import DataContainer from '@/components/DataContainer.vue';
import { mapGetters, mapMutations } from "vuex";
import itemSelect from "@/mixins/item-select";
import user from "@/domain/User/Mixins/user";
import UserNotification from "@/domain/User/Components/UserNotification.vue";

export default {
    name: "UserNotifications",
    mixins: [itemSelect, user],
    components: {UserNotification, DataContainer },
    data(){
        return {
          loading: false,
          error: null,
        }
    },

    computed: {
        ...mapGetters(['current_user']),
    },

    methods: {
      ...mapMutations(['SET_USER_PROFILE_KEYS']),

      refreshUserNotifications(){
            this.loading = true;
            this.error = null;
            this.getUserNotifications().then(notifications => {
              this.items = notifications;
              this.SET_USER_PROFILE_KEYS({ notifications });
            })
            .catch(e => this.error = e )
            .finally(() => this.loading = false )
        },

      updateNotification(notification) {
          const index = this.items.findIndex(n => n.id === notification.id);
          if(index >= 0) {
            this.items.splice(index, 1, notification);
          }
          this.SET_USER_PROFILE_KEYS({ notifications: this.items });
      },

      markNotificationsAsRead(ids) {
        this.getUserNotifications(ids, true).then(notifications => {
          notifications.forEach(notification => {
            this.updateNotification(notification);
            this.unselectItem(notification.id);
          });
          this.$store.commit("SNACKBAR", {
            status: true,
            text: `${notifications.length} notifications marked as read`,
            color: 'primary'
          })
        })
      },
    },

    mounted(){
        this.items = this.current_user?.profile?.notifications || []
    },
}
</script>