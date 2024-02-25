<template>
  <corner-dialog
      v-model="dialog"
      width="400"
      persistent
      scrollable
  >
    <template v-if="hasActivator" v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="$attrs.activator"
          v-on="on"
      >
        <slot>Add Integration</slot>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span>Integrations</span>
        <v-btn icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <business-integration-type-select>
          <template #default="{ loading, integrations }">
            <data-container :loading="loading">
              <integration-card
                  v-for="integration in integrations"
                  :key="integration.identitier"
                  :integration="{ type: integration }"
                  :business="business"
                  class="my-1"
                  v-on="$listeners"
                  @integration-created="integrationCreated"
              >
                <template #setup="{ integration: intgtn, business, info, save, saving }">
                  <component
                      :is="`${intgtn.type.identifier}-setup`"
                      :business="business"
                      :integration="intgtn"
                      :info="info"
                      :saving="saving"
                      @setup="save"
                  />
                </template>
              </integration-card>
            </data-container>
          </template>
        </business-integration-type-select>
      </v-card-text>
    </v-card>
  </corner-dialog>
</template>

<script>
import CornerDialog from "@/components/CornerDialog.vue";
import BusinessIntegrationTypeSelect from "@/domain/Business/Components/BusinessIntegrationTypeSelect.vue";
import IntegrationCard from "@/domain/Business/Widgets/IntegrationCard.vue";

import PaystackSetup from "@/domain/Business/Integrations/Paystack.vue";
import MailgunSetup from "@/domain/Business/Integrations/Mailgun.vue";
import SmileSetup from "@/domain/Business/Integrations/Smile.vue";
import EzeeSetup from "@/domain/Business/Integrations/Ezee.vue";
import StripeSetup from "@/domain/Business/Integrations/Stripe.vue";
import MessageBirdSetup from "@/domain/Business/Integrations/MessageBird.vue";
import DataContainer from "@/components/DataContainer.vue";
export default {
  name: "BusinessIntegrationDialog",
  components: {
    DataContainer,
    IntegrationCard,
    BusinessIntegrationTypeSelect,
    CornerDialog,
    PaystackSetup,
    MailgunSetup,
    SmileSetup,
    EzeeSetup,
    StripeSetup,
    MessageBirdSetup
  },
  data() {
    return {
      dialog: false,
    }
  },

  props: {
    business: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },

  methods: {
    integrationCreated(integration) {
      this.$store.commit('SNACKBAR', {
        status: true,
        text: `${integration.title} created successfully`,
        color: 'success'
      })
      this.dialog = false;
    }
  }
}
</script>