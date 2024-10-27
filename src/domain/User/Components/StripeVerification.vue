<template>
    <data-container :loading="loading" :error="getVerificationError" @retry="getVerification">
      <v-card flat v-bind="$attrs" :loading="continuing || starting">
        <v-card-text v-if="dataVerification">
          <div class="d-flex flex-nowrap align-center">
            <div class="text-uppercase">Status:</div>
            <v-chip
                class="ma-2"
                :color="`${statuses[dataVerification.status] ? statuses[dataVerification.status].color : 'info'}`"
                text-color="white"
                small
            >
              <span>{{  statuses[dataVerification.status] ? statuses[dataVerification.status].tag : dataVerification.status }}</span>
            </v-chip>
          </div>
          <div v-if="isOwner && dataVerification.status === 'requires_input'" >
            <v-btn @click="continueVerificationSession" text small color="primary" :loading="continuing">Complete ID Verification</v-btn>
            <error-handler :error="continueVerificationError" @retry="continueVerificationSession" />
          </div>
          <v-btn v-if="dataVerification.status !== 'verified' && manualCheck" class="ma-1"
                 small text color="primary"
                 @click="getVerification"
                 :loading="loading"
                  >
            <v-icon size="18">mdi-refresh</v-icon> check status again
          </v-btn>
        </v-card-text>
        <v-card-text v-else class="text-center grey--text">
          <p>No verification available</p>
          <error-handler :error="startVerificationError" @retry="createStripeVerificationSession" />
          <v-btn
             @click="createStripeVerificationSession"
             small text
             color="primary"
             :loading="starting"
          > Start Verification </v-btn>
        </v-card-text>
      </v-card>
      <stripe-id-gateway ref="stripeId" />
    </data-container>
</template>

<script>
import StripeIdGateway from "@/components/Utilities/StripeIdGateway";
import ErrorHandler from "@/components/ErrorHandler";
import DataContainer from "@/components/DataContainer";
import {mapActions} from "vuex";
import id_verification from "@/domain/User/Mixins/id_verification";

export default {
    name: "UserStripeVerification",
    mixins: [id_verification],
    components: {
      DataContainer,
      ErrorHandler,
      StripeIdGateway,
    },
    
    data(){
        return {
            loading: false,
            continuing: false,
            starting: false,
            dataVerification: null,
            trial: 0,
            session: null,
            getVerificationError: null,
            continueVerificationError: null,
            startVerificationError: null,
            verificationOngoing: false,
        }
    },

    props: {
        user: Object,
        verification: Object,
        isOwner: Boolean,
        poll: {
            default: true
        },
        manualCheck: {
            default: false
        }
    },

    computed: {
      statuses() {
          return {
            'requires_input': {
              tag: 'Abandoned',
              color: 'warning'
            },
            'verified': {
              tag: 'Verified',
              color: 'success'
            }
          }
      }
    }, 

    methods: {
        ...mapActions(['query', 'mutate']),
        getVerification() {
          this.getVerificationError = null;
          this.loading = true;
          this.getUserStripeVerification(this.user.id, this.verification.stripe.id)
          .then(session => {
              this.dataVerification = session;
              this.$emit('updated', this.dataVerification);
          })
          .catch(e => {
              this.getVerificationError = e;
          })
          .finally(() => {
              this.loading = false;
          })
      },

     continueVerificationSession() {
      this.continuing = true;
      this.continueVerificationError = null;
      this.$emit('session', 'stripe')
      this.getUserStripeVerification(this.user.id, this.verification.stripe.id)
      .then(session => {
        this.session = session;
        this.verificationOngoing = true;
        return this.$refs.stripeId.verify(this.session.client_secret)
      })
      .then(result => {
        this.$emit('result', result);
      })
      .catch(e => {
        this.continueVerificationError = e;
        this.$emit('error');
      })
      .finally(() => {
        this.continuing = false;
      })
    },

      createStripeVerificationSession(){
        this.starting = true;
        this.startVerificationError = null;
        this.$emit('session', 'stripe')
        this.createUserStripeVerification(
            this.user.id,
            this.convertObjectToMetaKeyValue(this.metadata),
            this.redirect ? this.redirect : this.url(this.$router.resolve({name: this.$router.currentRoute.name}).route.fullPath),
            this.redirect ? this.redirect+'&vs_refresh=1' : this.url(this.$router.resolve({name:  this.$router.currentRoute.name, query: {vs_refresh: 1}}).route.fullPath)
        )
        .then(session => {
          this.session = session;
          this.$emit('created', this.session);
          this.verificationOngoing = true;
          return this.$refs.stripeId.verify(this.session.client_secret);
        })
        .then(result => {
          this.$emit('result', result);
          return this.getVerification()
        })
        .catch(e => {
          this.startVerificationError = e;
          this.$emit('error');
        })
        .finally(() => {
          this.starting = false;
          this.verificationOngoing = false;
        })
      }
    },
    
    watch: {
        verification: {
            immediate: true,
            handler(verification) {
                if(verification?.stripe) this.getVerification();
            }
        }
    }
}
</script>