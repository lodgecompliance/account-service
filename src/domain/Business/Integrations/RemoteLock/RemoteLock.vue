<template>          
    <integration-setup
        :open="open"
        title="Remotelock/Lockstate"
        :subtitle="`Remotelock for ${ property.name }`"
        :fetch-query="getQuery"
        @fetched="remotelockFetched"
        @close="open = false"
    >

      <error-handler :error="error" :can-retry="false" />
      <template v-if="authorization">
        <v-alert
            colored-border
            border="left"
            type="success"
        >Connected to a Remotelock account
        </v-alert>
      </template>
      <template v-else>
          <v-alert
              border="left"
              colored-border
              type="error">
              Property is not connected to a Lockstate account
          </v-alert>
      </template>
      <v-card flat class="mt-5">
        <v-tabs v-model="tab" >
          <v-tab>
            Configuration
          </v-tab>
          <v-tab>
            Devices
          </v-tab>
          <v-tab>
            Accesses
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card flat>
              <v-card-text>
                <v-row justify="space-around">
                  <v-col>
                    <v-select
                        outlined dense
                        :items="strategies"
                        item-value="value"
                        item-text="label"
                        v-model="settings.pin_strategy"
                        label="PIN Strategy"
                    >
                    </v-select>
                  </v-col>
                  <v-col>
                    <v-text-field
                        outlined
                        dense
                        label="Days in advance"
                        type="number"
                        v-model="settings.days_in_advance"
                        :suffix="`days`"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row justify="space-around">
                  <v-col>
                    <v-text-field
                        outlined
                        dense
                        label="Start time"
                        type="time"
                        v-model="settings.start_time"
                    >
                    </v-text-field>
                  </v-col>
                  <v-col>
                    <v-text-field
                        outlined
                        dense
                        label="End time"
                        type="time"
                        v-model="settings.end_time"
                    >
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn @click="save" color="primary" :loading="saving" depressed>Save changes</v-btn>
              </v-card-actions>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <remotelock-devices :property="property" />
          </v-tab-item>
          <v-tab-item>
            <remotelock-accesses :property="property" />
          </v-tab-item>
        </v-tabs-items>
      </v-card>

      <template #actions>
        <v-spacer></v-spacer>
        <template v-if="authorization">
          <v-btn
              dark
              color="error"
              :loading="connecting"
              @click="disconnect" depressed
          >
            <v-icon class="mr-2">mdi-cancel</v-icon> Disconnect
          </v-btn>
        </template>
        <template v-else>
          <v-btn
              dark
              color="primary"
              :loading="connecting"
              @click="connect" depressed
          >
            Connect to Lockstate
          </v-btn>
        </template>
      </template>
    </integration-setup>
</template>

<script>
import gql from 'graphql-tag';
import config from '../../../../config';
import RemotelockAccesses from './RemoteLockAccesses.vue';
import RemotelockDevices from './RemoteLockDevices.vue';
import IntegrationSetup from "@/domain/Property/Integrations/Setup";
import ErrorHandler from "@/components/ErrorHandler.vue";

export default {
    name: "RemoteLockIntegration",
    components: {
      ErrorHandler,
      IntegrationSetup, RemotelockAccesses,
        RemotelockDevices
    },
    props: {
        property: Object,
    },
    data(){
        return {
            open: false,
            getQuery: {},
            remotelock: null,
            settings: {
                pin_strategy: null,
                start_time: null,
                end_time: null,
                days_in_advance: null
            },
            saving: false,
            error: null,
            connecting: false,
            strategies: [
                {
                    label: "Random 4 digits",
                    value: "random_4_digits"
                }
            ],
          tab: 0
        }
    }, 

    computed: {
        authorization() {
            return this.remotelock ? this.remotelock.authorization : null
        },
    },

    methods: {
        remotelockFetched(response) {
          this.remotelock = response.getPropertyIntegrations.remotelock;
          this.setForm();
        },

        setForm() {
            this.settings = this.remotelock?.settings || {}
        },

        connect(){
            this.connecting = true;
            const clientId = config.remote_lock.client_id;
            const redirect_uri = config.app.env == 'local' ? "urn:ietf:wg:oauth:2.0:oob" : this.url(this.$router.resolve({name: 'property.remotelock.callback'}).route.fullPath);
            window.localStorage.setItem('property-lockstate-connect', JSON.stringify({id: this.property.id, redirect_uri}));
            window.location.href = `https://connect.remotelock.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=code`;
        },

        disconnect(){
            this.connecting = true;
            this.$store.dispatch('mutate', {
                mutation: gql`
                    mutation unsetPropertyRemotelockAuthorization($property_id: ID!){
                        unsetPropertyRemotelockAuthorization(property_id: $property_id)
                    }
                `,
                variables: {
                    property_id: this.property.id,
                }
            })
            .then(response => {
                if(response.data.unsetPropertyRemotelockAuthorization) {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Remotelock disconnected",
                        color: "success"
                    });
                    this.remotelock.authorization = null
                    this.$emit('updated');
                }
            })
            .catch(e => {
                this.$store.commit('TOAST_ERROR', {
                    show: true,
                    message: `Disconnection failed. `,
                    retry: () => this.disconnect(),
                    exception: e
                })
            })
            .finally(() => {
                this.connecting = false;
            })
        },

        save() {
            this.saving = true;
            this.error = null;
            this.settings.days_in_advance = parseInt(this.settings.days_in_advance);
            this.$store.dispatch('mutate', {
                mutation: gql`
                mutation updatePropertyRemotelockIntegrationSettings($property_id: ID!, $data: PropertyRemoteLockIntegrationSettingsInput!) {
                    updatePropertyRemotelockIntegrationSettings(property_id: $property_id, data: $data) {
                        pin_strategy
                        start_time
                        end_time
                        days_in_advance
                    }
                }
                `,
                variables: {
                    property_id: this.property.id,
                    data: this.settings
                }
            })
            .then(response => {
                const settings = response.data.updatePropertyRemotelockIntegrationSettings;
                if(settings) {
                    this.settings = settings;
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: "Remotelock updated",
                        color: "success"
                    });
                    this.$emit('updated', {
                        remotelock: {
                            ...this.credentials,
                            settings
                        }
                    })
                }
            })
            .catch(e => {
                this.error = e;
            })
            .finally(() => {
                this.saving = false;
            })
        },
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
                       remotelock {
                          authorization {
                              token_type
                          }
                          settings {
                              pin_strategy
                              start_time
                              end_time
                              days_in_advance
                          }
                      }
                    }
                }`,
            variables: {
              property_id: property.id
            }
          }
        }
      }
    }
}
</script>