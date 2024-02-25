<template>
    <integration-setup
        :open="open"
        title="Zapier"
        :subtitle="`Zapier integration for ${ property.name }`"
        :fetch-query="getQuery"
        @fetched="zapierFetched"
        @close="open = false"
    >
      <v-list>
          <v-list-item three-line>
            <v-list-item-icon class="mr-2">
              <v-icon v-if="zapier.authorized" v-text="'mdi-check-circle'" color="success"></v-icon>
              <v-icon v-else v-text="'mdi-close-circle'" color="error"></v-icon>
            </v-list-item-icon>
            <v-list-item-content >
              <v-list-item-title>Authorized</v-list-item-title>
              <v-list-item-subtitle v-if="zapier.authorized">
                There is an access token currently being used by Zapier to access data in {{ property.name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle v-else>
                There is no access token for Zapier to access data in {{ property.name }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item :disabled="!zapier.authorized">
            <v-list-item-icon class="mr-2">
              <v-icon v-text="'mdi-clock'"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                Last Poll:
                <span v-if="lastPoll">{{ lastPoll.format('MMMM Do YYYY, hh:mm a') }}, {{ lastPoll.fromNow() }}</span>
                <span v-else>Never polled</span>
              </v-list-item-title>
              <v-list-item-subtitle>
                Last time Zapier polled data for {{ property.name }} for its triggers
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      <template #actions>
          <v-btn v-if="zapier.zapier_authorized" small @click="$refs.confirmation.open()" color="error"><v-icon>mdi-cancel</v-icon> Revoke Zapier access</v-btn>
      </template>
      <confirmation-dialog ref="confirmation" @confirmed="revoke">
          <div class="text-center mt-5">
              <p>
                  Are you sure you want to revoke Zapier access to {{ property.name }}.
              </p>
          </div>
      </confirmation-dialog>
    </integration-setup>
</template>

<script>
import moment from 'moment';
import ConfirmationDialog from '../../../components/Utilities/ConfirmationDialog.vue';
import IntegrationSetup from "@/domain/Business/Widgets/Setup.vue";
import gql from "graphql-tag";

export default {
    name: "ZapierIntegration",
    components: {
      IntegrationSetup, ConfirmationDialog
    },
    data(){
        return {
          open: false,
          getQuery: {},
          zapier: {}
        }
    },
    computed: {
        lastPoll() {
            if(!this.zapier.last_poll) return null;
            return moment.unix(this.ezee.last_poll);
        }
    },
    props: {
        property: Object,
    },
    methods: {

      zapierFetched(response) {
        this.zapier = response.getPropertyIntegrations.zapier || {}
      },

      revoke() {
          this.$store.commit("SNACKBAR", {
              status: true,
              text: "Not available yet",
              color: "info",
          })
      }
    },

    watch: {
      property: {
        immediate: true,
        handler(property) {
          if(!property) this.getQuery = null;
          this.getQuery = {
            query: gql`
            query getPropertyIntegrations($property_id: ID!){
              getPropertyIntegrations(property_id: $property_id){
                  zapier {
                    authorized
                    last_poll
                }
              }
           }`,
            variables: {
              property_id: this.property.id
            }
          };
        }
      }
    }
}
</script>