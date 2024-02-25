<template>
  <div>
    <error-handler :error="error" />
    <v-form v-if="connected" ref="form" >
      <v-alert
          colored-border
          border="left"
          type="success"
      >
        Connected as <strong>{{credentials.account.name}}</strong>
      </v-alert>

      <div class="d-flex justify-space-between">
        <v-btn
            color="primary"
            :loading="saving"
            @click="save"
            depressed>Update Status
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="red" dark :loading="disconnecting" @click="disconnect" depressed>Disconnect</v-btn>
      </div>
    </v-form>
    <v-btn v-else color="primary" :loading="connecting" @click="connect" depressed>Connect</v-btn>
  </div>
</template>

<script>
import integration_setup from "@/domain/Business/Mixins/integration_setup";
import integration from "@/domain/Business/Mixins/integration";
import ErrorHandler from "@/components/ErrorHandler.vue";

export default {
  name: "MessageBirdSetup",
  components: {ErrorHandler},
  mixins: [integration_setup, integration],
  data() {
      return {
        error: null,
        connecting: false,
        disconnecting: false,
        disconnected: false,
      }
  },
  computed: {
    connected() {
      return !!this.credentials?.account
    }
  },
  methods: {
    save() {
      this.$emit('setup', {
        credentials: this.credentials,
      })
    },

    async connect() {
      try {
        this.error = null;
        this.connecting = true;
        let integration = this.integration;
        if(!integration?.id) {
          integration = await this.createBusinessIntegration(this.business.id, {
            ...this.info,
            enabled: false,
          })
        }
        integration = await this.connectBusinessMessageBirdAccountIntegration(this.business.id, integration.id)
        this.$emit('setup', {
          credentials: integration.credentials
        });
      } catch (e) {
        this.error = e
      } finally {
        this.connecting = false
      }
    },

    disconnect() {
        this.error = null;
        this.disconnecting = true;
        this.disconnectBusinessMessageBirdAccountIntegration(this.business.id, this.integration.id)
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

  },
}
</script>