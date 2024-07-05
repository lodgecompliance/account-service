<template>
    <data-container :loading="loading" :error="error" @retry="syncVerification">
      <country-select
          dense outlined
          label="Country"
          item-text="label"
          item-value="value"
          v-model="country"
          @change="saveCountry"
      />
      <stripe-verification
          v-if="provider === 'stripe'"
          :user="user"
          :verification="verification.stripe"
          @error="useManual = true"
          @result="stripeVerificationResult"
      />
      <smile-verification
          v-if="provider === 'smile'"
          :user="user"
          :verification="verification.smile"
          @error="useManual = true"
          @submitted="smileVerificationSubmitted"
      />
      <template v-if="useManual || (verification[provider] && !verification[provider].verified)">
        <p class="text-center">Your verification is not successful yet, kindly provide us alternative document</p>
        <manual-verification
            :user="user"
            :country="country"
            :verification="verification"
            @saved="synced => $emit('synced', synced)"
        />
      </template>
    </data-container>
</template>

<script>
import StripeVerification from '@/domain/User/Components/StripeVerification.vue';
import SmileVerification from '@/domain/User/Components/SmileVerification.vue';
import user from "@/domain/User/Mixins/user";
import id_verification from "@/domain/User/Mixins/id_verification";
import DataContainer from "@/components/DataContainer.vue";
import ManualVerification from "@/domain/User/Components/ManualVerification.vue";
import CountrySelect from "@/components/Utilities/CountrySelect.vue";

export default {
    name: "UserIdentityVerificationSetting",
    mixins: [id_verification, user],
    components: {
      CountrySelect,
      ManualVerification,
      DataContainer,
       StripeVerification, SmileVerification
    },
    data(){
        return {
            country: null,
            results: {
              stripe: null,
              smile: null,
            },
          loading: false,
          error: null,
          useManual: false,
        }
    },
    props: {
        user: Object,
        verification: Object,
    },
    computed: {
      isMine(){
          if(this.verification && this.verification.user_id) {
              return this.verification.user_id === this.$store.getters.current_user.profile.id
          }
          return false;
        },
      provider() {
        return this.verification.provider;
      }
    },
    methods: {
      syncVerification() {
        this.loading = true;
        this.getUserVerification(this.user.id).then(verification => {
          this.$emit('synced', verification)
        }).catch(e => this.error = e).finally(() => this.loading = false )
      },

      stripeVerificationResult(result) {
        this.results.stripe = result;
        this.syncVerification()
      },

      smileVerificationSubmitted(result) {
        this.results.smile = result;
        this.syncVerification();
      },

       saveCountry() {
        this.loading = true;
         this.saveUserIdVerification({ country: this.country })
         .then(() => this.syncVerification())
       }
    },
    watch: {
      verification: {
        immediate: true,
        handler(v) {
          this.country = v?.country
        }
      }
    }
}
</script>