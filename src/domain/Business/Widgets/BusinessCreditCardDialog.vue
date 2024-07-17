<template>
  <v-dialog
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
        <slot>Add card</slot>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Add Card</span>
        <v-spacer></v-spacer>
        <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-card-text class="py-5">
        <stripe-credit-card-form
            ref="stripeCreditCard"
            :publishable-key="stripePublishableKey"
            :type="`create-token`"
            :token-callback="stripeTokenCallback"
            @token-callback="tokenCallbackSuccessfull"
            @error="tokenCallbackError"
            @abort="tokenCallbackAborted"
        >
          <template #submit-btn-text>Add card</template>
        </stripe-credit-card-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import StripeCreditCardForm from '@/components/Utilities/StripeCardGateway.vue';
import credit_card from "@/domain/Business/Mixins/credit_card";

export default {
  name: "BusinessCreditCardDialog",
  components: { StripeCreditCardForm },
  mixins: [credit_card],
  data() {
    return {
      dialog: false
    }
  },
  props: {
    business: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },
  computed: {
    stripePublishableKey(){
      return process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY
    },
  },
  methods: {
    stripeTokenCallback(token){
      return this.addBusinessCreditCard(this.business.id, token.id)
    },

    tokenCallbackSuccessfull(data){
      if(!data) return;
      this.$emit('credit-card-added', data);
      this.$store.commit("SNACKBAR", {
        status: true,
        text: "Credit card added",
        color: "success"
      });
      this.dialog =  false;
    },

    tokenCallbackError(e){
      if(!e) return;
      this.$store.commit('SNACKBAR', {
        status: true,
        color: 'error',
        text: `${e.message}`
      })
    },

    tokenCallbackAborted(card){

    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(route) {
        this.dialog = route.name === 'business.billing' && route.query.action === 'add-new';
      }
    }
  }
}
</script>