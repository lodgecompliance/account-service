<template>          
    <section>
      <error-handler :error="error" :can-retry="false" />
        <div v-if="connected">
              <div v-if="account" class="">
                  <p class="grey--text">Stripe connected as</p>
                  <h2 class="headline"> {{ account.name }} </h2>
                  <a v-if="account.url" :href="account.url" class="text-decoration-none" target="_blank">{{ account.url }}</a>
              </div>
              <v-alert
                  v-else
                  border="left"
                  colored-border
                  type="success">
                  Stripe connected
              </v-alert>
          <div class="d-flex justify-space-between">
            <v-btn
                color="primary"
                :loading="saving"
                @click="save"
                depressed
            >Save changes
            </v-btn>
            <v-btn
                dark
                color="error"
                :loading="disconnecting"
                @click="disconnect" depressed
            >
              <v-icon class="mr-2">mdi-cancel</v-icon> Disconnect
            </v-btn>
          </div>
          </div>
        <div v-else>
          <v-alert
              border="left"
              colored-border
              type="error">
              Stripe not connected
          </v-alert>
          <div class="my-5">
              <v-btn
                  dark
                  color="primary"
                  :loading="connecting"
                  @click="connect" depressed
                  >
                  Connect Stripe
              </v-btn>
          </div>
        </div>

    </section>
</template>

<script>
import config from '@/config';
import ErrorHandler from "@/components/ErrorHandler.vue";
import integration_setup from "@/domain/Business/Mixins/integration_setup";
import integration from "@/domain/Business/Mixins/integration";

export default {
    name: "StripeSetup",
    mixins: [integration_setup, integration],
    components: {
      ErrorHandler,
    },
    data(){
        return {
            error: null,
            connecting: false,
            disconnecting: false,
            disconnected: false,
        }
    }, 

    computed: {
        connected(){
            return !!this.credentials?.stripe_user_id
        },
    },

    methods: {
      async connect(){
        this.connecting = true;
        let integration = this.integration;
        if(!integration?.id) {
          integration = await this.createBusinessIntegration(this.business.id, {
            ...this.info,
            enabled: false,
          })
        }
          const clientId = config.stripe.client_id;
          const return_uri = this.url(this.$router.resolve({name: 'business.stripe.connect.callback'}).route.fullPath);
          window.localStorage.setItem('stripe-connect-business-id', this.business.id)
          window.localStorage.setItem('stripe-connect-integration-id', integration.id)
          window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write&redirect_uri=${return_uri}`;
      },

      disconnect(){
          this.disconnecting = true;
          this.connectBusinessStripeIntegration(this.business.id, this.integration.id)
          .then(() => {
            this.$emit('setup', {
              credentials: {},
            })
          })
          .catch(e => {
              this.error = e;
          })
          .finally(() => {
              this.disconnecting = false;
          })
      },

      save() {
          this.$emit('setup', {
            credentials: this.credentials,
          })
      },
    },

}
</script>