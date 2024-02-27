<template>
  <app-layer ref="app">
    <data-container :loading="loading" :error="error">
      <v-sheet class="pa-3" rounded>
          <v-alert
              v-if="callbackError && callbackError === 'access_denied'"
              border="left"
              colored-border
              type="error">
            Access was denied for Stripe Connect
          </v-alert>
          <v-alert
              v-if="!callbackCode"
              border="left"
              colored-border
              type="error">
            Authorization failed
          </v-alert>
      </v-sheet>
    </data-container>
  </app-layer>
</template>

<script>

import { mapMutations } from 'vuex';
import AppLayer from '@/AppLayer';
import DataContainer from '@/components/DataContainer.vue';
import current_business from "@/domain/Business/Mixins/current_business";
import business from "@/domain/Business/Mixins/business";
import integration from "@/domain/Business/Mixins/integration";

export default {
  name: 'BusinessStripeConnectCallback',
  mixins: [current_business, business, integration],
  components: {
    AppLayer, DataContainer
  },
  data(){
    return {
      loading: false,
      error: null,
    }
  },

  computed:{
    businessId(){
      return window.localStorage.getItem('stripe-connect-business-id')
    },
    integrationId(){
      return window.localStorage.getItem('stripe-connect-integration-id')
    },
    callbackError(){
      return this.$route.query.error
    },
    callbackCode(){
      return this.$route.query.code
    }
  },

  methods: {

    ...mapMutations([
      'SET_MODE', 'SNACKBAR'
    ]),

    startConnect(){
      if(!(this.businessId && this.integrationId && this.callbackCode)) {
        this.$router.push({name: 'home'});
      }
      if(this.businessId !== this.currentBusiness.id) {
        this.SET_MODE(this.businessId)
      }
      this.loading = true;
      this.connectBusinessStripeIntegration(this.businessId, this.integrationId, this.callbackCode)
      .then(authResponse => {
        window.localStorage.removeItem('stripe-connect-business-id');
        window.localStorage.removeItem('stripe-connect-integration-id');
        if(authResponse){
          this.SNACKBAR({
            status: true,
            text: 'Stripe successfully connected to '+this.currentBusiness.name,
            color: 'success'
          });
          this.$router.push({ name: 'business.integrations', params: { business: this.businessId }})
        }else{
          this.error = new Error("Stripe connect could not be completed.")
        }
      })
      .catch(e => {
        this.error = e;
      })
      .finally(() => {
        this.loading = false;
      })
    },
  },

  mounted(){
    this.startConnect();
  }
}
</script>
