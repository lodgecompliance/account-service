<template>
    <v-card>
      <v-card-title class="flex-nowrap">
        <span class="text-truncate"><v-icon>mdi-bell</v-icon> {{ notification.title }}</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text>
        <data-container :loading="loading" :error="error" @retry="getNotification">
          <template v-if="notificationData">
            <h4 class="headline">{{ notificationData.subject }}</h4>
            <div class="mt-3" v-html="notificationData.body"></div>
          </template>
        </data-container>
      </v-card-text>
      <v-card-actions v-if="notificationData && actions.length">
        <v-btn
            v-for="(action, i) in actions"
            :key="`notification-action-${i}`"
            :to="action.route"
            class="mx-1"
            color="primary"
            text
        >
          {{ action.label }}
        </v-btn>
      </v-card-actions>
    </v-card>
</template>

<script>
  import gql from 'graphql-tag';
  import DataContainer from "@/components/DataContainer.vue";

    export default {
        name: "UserNotificationDetails",
        components: {DataContainer},
        data(){
            return {
              error: null,
              loading: false,
              notificationData: null
            }
        },
        props: {
            notification: Object,
        },
        computed: {
            metadata() {
              return this.convertMetaKeyValueToObj(this.notification.metadata || [])
            },
            actions() {
                const actions = [];
                const query = {
                  from: 'notifications',
                  notification: this.notification.type,
                  ...this.metadata
                }
                if(this.metadata.reservation_id) {
                  actions.push({
                    label: "Go To Reservation",
                    route: {
                      name: 'reservation.show',
                      params: { id: this.metadata.reservation_id },
                      query
                    }
                  })
                }
                return actions;
            }
        },
        methods: {
          getNotification(){
            this.dialog = true;
            if(this.notification.read_at && this.notification.body) {
              this.notificationData = this.notification;
              return;
            }
            this.error = null;
            this.loading = true;
            this.notificationData = null;
            this.queryNotification(true).then(notification => {
              this.notificationData = notification
            })
            .catch(e => {
              this.error = new Error("Notification could not be fetched");
            })
            .finally(() => {
              this.loading = false
            })
          },
          queryNotification(markAsRead = true) {
            return new Promise((resolve, reject) => {
              this.$store.dispatch('query', {
                query: gql`
                query getUserNotification($id: ID!, $mark_as_read: Boolean){
                    getUserNotification(id: $id, mark_as_read: $mark_as_read){
                        id
                        type
                        title
                        subject
                        body
                        text
                        time
                        timestamp
                        read
                        read_at
                        metadata {
                            key
                            value
                        }
                    }
                }`,
                variables: {
                  id: this.notification.id,
                  mark_as_read: markAsRead
                }
              }).then(response => {
                const notification = response.data.getUserNotification
                    ? response.data.getUserNotification
                    : this.notification;
                this.$emit('update-notification', notification);
                return resolve(notification)
              }).catch(e => reject(e))
            })
          }
        },

        mounted() {
          this.getNotification();
        },
    }
</script>