<template>
    <data-container :loading="loading" :error="error" @retry="syncVerification">
        <stripe-verification
            v-if="provider === 'stripe'"
            :user="user"
            :verification="verification.stripe"
            @result="stripeVerificationResult"
        />
        <smile-verification
            v-if="provider === 'smile'"
            :user="user"
            :verification="verification.smile"
            @submitted="smileVerificationSubmitted"
        />
    </data-container>
</template>

<script>
import StripeVerification from '@/domain/User/Components/StripeVerification.vue';
import SmileVerification from '@/domain/User/Components/SmileVerification.vue';
import id_verification from "@/domain/User/Mixins/id_verification";
import DataContainer from "@/components/DataContainer.vue";

export default {
    name: "UserIdentityVerification",
    mixins: [id_verification],
    components: {
      DataContainer,
       StripeVerification, SmileVerification
    },
    data(){
        return {
            provider: null,
            results: {
              stripe: null,
              smile: null,
            },
          loading: false,
          error: null
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
    },
    methods: {
      syncVerification() {
        this.loading = true;
        this.getUserVerification(this.user.id).then(verification => {
          this.$emit('synced', verification)
        }).catch(e => this.error = e).finally(() => this.loading = false )
      },

      determineProvider(verification) {
        if(["NG"].includes(verification.country)) {
          this.provider = "smile";
        } else {
          this.provider = "stripe"
        }
      },

      stripeVerificationResult(result) {
        this.results.stripe = result;
        this.syncVerification()
      },

      smileVerificationSubmitted(result) {
        this.results.smile = result;
        this.syncVerification();
      }
    },
    watch: {
      verification: {
        immediate: true,
        handler(v) {
          this.determineProvider(v)
        }
      }
    }
}
</script>