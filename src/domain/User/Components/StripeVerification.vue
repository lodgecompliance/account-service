<template>
    <data-container :loading="loading" :error="getVerificationError" @retry="getVerification">
      <v-card flat v-bind="$attrs" :loading="continuing || starting">
        <v-card-text v-if="dataVerification">
          <div class="d-flex flex-wrap align-items-center justify-space-between">
            <div class="text-uppercase">Verification Type: {{ dataVerification.type  }}</div>
            <v-chip
                class="ma-2"
                :color="`${statuses[dataVerification.status] ? statuses[dataVerification.status].color : 'info'}`"
                text-color="white"
                small
            >
              <span>{{  statuses[dataVerification.status] ? statuses[dataVerification.status].tag : dataVerification.status }}</span>
            </v-chip>
          </div>
          <p>Updated {{ lastUpdated }}</p>
          <div v-if="isMine && dataVerification.status === 'requires_input'" >
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
          <template v-if="dataVerification.last_verification_report">
            <slot name="verification" v-bind="{ verification: dataVerification }" />
            <v-btn class="ma-1" small text color="primary" @click="$refs.report.open()">View Verification</v-btn>
          </template>
          <verification-report ref="report" :verification="verification" />
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
import moment from 'moment';
import VerificationReport from './StripeVerificationReport.vue';
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
       VerificationReport
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
        poll: {
            default: true
        },
        manualCheck: {
            default: false
        }
    },

    computed: {
        isMine(){
            if(this.verification && this.verification.metadata) {
                return this.verification.metadata.user_id === this.$store.getters.current_user.profile.id
            } 
            return false;
        },

        lastUpdated() {
            if(!this.verification?.timestamp?.updated_at) return null;
            return moment.unix(this.verification.timestamp.updated_at).fromNow();
        },

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
            this.getUserStripeVerification(this.user.id, this.verification.id)
            .then(session => {
                this.dataVerification = session;
                this.$emit('updated', this.dataVerification);
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `Verification status updated`,
                    color: 'info'
                });
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
          this.getUserStripeVerification(this.user.id, this.verification.id)
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
          })
          .finally(() => {
            this.continuing = false;
          })
      },

      createStripeVerificationSession(){
        this.starting = true;
        this.startVerificationError = null;
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
                this.dataVerification = verification;
            }
        }
    }
}
</script>