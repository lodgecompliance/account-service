<template>
  <div v-if="!integrations.length" class="text-center grey--text py-5">
    There is no integration yet
  </div>
  <v-row v-else>
    <v-col
        v-for="integration in integrations"
        :key="integration.id"
        cols="6" md="4"
    >
      <integration-card
          :business="business"
          :integration="integration"
          @integration-updated="integrationUpdated"
      >
        <template #setup="{ save, saving, business, integration, info, closeSetup }">
          <component
              :is="`${integration.type.identifier}-setup`"
              :business="business"
              :integration="integration"
              :info="info"
              :saving="saving"
              @setup="save"
              @setup-saved="closeSetup"
          />
        </template>
      </integration-card>
    </v-col>
  </v-row>
</template>

<script>

import PaystackSetup from "@/domain/Business/Integrations/Paystack.vue";
import BusinessIntegrationTypeSelect from "@/domain/Business/Components/BusinessIntegrationTypeSelect.vue";
import IntegrationCard from "@/domain/Business/Widgets/IntegrationCard.vue";
import IntegrationSetup from "@/domain/Business/Widgets/IntegrationSetup.vue";
import MailgunSetup from "@/domain/Business/Integrations/Mailgun.vue";
import SmileSetup from "@/domain/Business/Integrations/Smile.vue";
import EzeeSetup from "@/domain/Business/Integrations/Ezee.vue";
import StripeSetup from "@/domain/Business/Integrations/Stripe.vue";
import MessageBirdSetup from "@/domain/Business/Integrations/MessageBird.vue";

// import ApiIntegration from "@/domain/Business/Integrations/Api.vue";
// import ZapierIntegration from "@/domain/Business/Integrations/Zapier.vue";

export default {
  name: 'BusinessIntegrations',
  components:{
    IntegrationSetup,
    IntegrationCard,
    BusinessIntegrationTypeSelect,
    EzeeSetup,
    MailgunSetup,
    PaystackSetup,
    SmileSetup,
    StripeSetup,
    MessageBirdSetup,
    // ZapierIntegration,
    // ApiIntegration,
  },
  data(){
    return {
      loading: false,
      integrations: [],
      newIntegration: null,
      newIntegrationDialog: false,
    };
  },
  props: {
    business: Object
  },
  methods: {
    integrationCreated(integration) {
      this.newIntegration = null;
      this.integrations.unshift(integration);
    },

    integrationUpdated(integration) {
      this.integrations = this.updateItemInArray(integration, 'id', this.integrations)
    }
  },
  watch: {
    business: {
      immediate: true,
      handler(business) {
        this.integrations = business?.integrations || []
      }
    }
  }
}
</script>
