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
          :verification="verification"
          :is-owner="isOwner"
          @error="useManual = true"
          @session="onVerificationSession"
          @result="stripeVerificationResult"
          @saved="synced => $emit('synced', synced)"
      />
      <smile-verification
          v-if="provider === 'smile'"
          :user="user"
          :verification="verification"
          :is-owner="isOwner"
          @error="useManual = true"
          @session="onVerificationSession"
          @submitted="smileVerificationSubmitted"
          @saved="synced => $emit('synced', synced)"
      />
      <template v-if="!currentSession">
        <div v-if="!verified && verification.manually_completed">
          <div class="mt-3">
            <v-alert
                colored-border
                border="left"
                type="info"
            >
              ID verification was not successful, but alternative manual ID was provided
            </v-alert>
            <v-btn v-if="isOwner" small color="primary" @click="submitManual" class="mt-2" depressed>Re submit ID</v-btn>
          </div>
        </div>
        <div v-if="useManual">
          <p class="text-center mt-5">Your verification was not successful, kindly provide us alternative document
          </p>
          <manual-verification
              :user="user"
              :country="country"
              :verification="verification"
              :require-upload="true"
              @saved="manualIdSubmitted"
          />
        </div>
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
          currentSession: null,
        }
    },
    props: {
        user: Object,
        verification: Object,
    },
    computed: {
      isOwner() {
        if(this.verification && this.verification.user_id) {
          return this.verification.user_id === this.$store.getters.current_user.profile.id
        }
        return false;
      },
      provider() {
        return this.verification?.provider;
      },
      verified() {
        return this.verification[this.provider] && this.verification[this.provider].verified
      }
    },
    methods: {
      onVerificationSession(session) {
        this.currentSession = session;
      },
      syncVerification() {
        this.loading = true;
        this.getUserVerification(this.user.id).then(verification => {
          this.$emit('synced', verification)
        }).catch(e => this.error = e).finally(() => this.loading = false )
      },

      stripeVerificationResult(result) {
        this.results.stripe = result;
        this.currentSession = null;
        this.syncVerification()
      },

      smileVerificationSubmitted(result) {
        this.results.smile = result;
        this.currentSession = null;
        this.syncVerification();
      },

       saveCountry() {
        this.loading = true;
         this.saveUserIdVerification({ country: this.country })
         .then(() => this.syncVerification())
       },

      submitManual() {
        this.currentSession = null;
        this.useManual = true;
      },
      manualIdSubmitted(verification) {
        this.useManual = false;
        this.$emit('synced', verification)
      }
    },
    watch: {
      verification: {
        immediate: true,
        handler(v) {
          this.country = v?.country;
        }
      }
    }
}
</script>