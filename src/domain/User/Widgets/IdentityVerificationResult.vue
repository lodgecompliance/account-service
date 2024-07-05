<template>
    <data-container :loading="loading" :error="error" @retry="getVerification">
      <stripe-verification-result
          v-if="provider === 'stripe' && verification.stripe"
          :verification="verification.stripe"
          flat
      />
      <smile-verification-result
          v-if="provider === 'smile' && verification.smile"
          :result="verification.smile"
          flat
      />
      <manual-verification-result
      v-else-if="verification.manually_completed"
      :verification="verification"
      flat
      />
      <v-alert v-else type="error" border="left" colored-border>
        Not Identity verification
      </v-alert>
    </data-container>
</template>

<script>

import user from "@/domain/User/Mixins/user";
import id_verification from "@/domain/User/Mixins/id_verification";
import DataContainer from "@/components/DataContainer.vue";
import StripeVerificationResult from "@/domain/User/Components/StripeVerificationResult.vue";
import SmileVerificationResult from "@/domain/User/Components/SmileVerificationResult.vue";
import ManualVerificationResult from "@/domain/User/Components/ManualVerificationResult.vue";

export default {
    name: "UserIdentityVerificationResult",
    mixins: [id_verification, user],
    components: {
      ManualVerificationResult,
      SmileVerificationResult,
      StripeVerificationResult,
      DataContainer,
    },
    data(){
        return {
          loading: false,
          error: null,
          verification: false,
        }
    },
    props: {
        userId: String,
    },
    computed: {
      provider() {
        return this.verification?.provider;
      }
    },
    methods: {
      getVerification() {
        this.loading = true;
        this.getUserVerification(this.userId).then(verification => {
          this.verification = verification;
        }).catch(e => this.error = e).finally(() => this.loading = false )
      },

    },
    watch: {
      userId: {
        immediate: true,
        handler(v) {
          this.getVerification();
        }
      }
    }
}
</script>