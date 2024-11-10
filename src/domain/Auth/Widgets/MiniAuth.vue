<template>
  <div>
    <data-container :loading="loading" :error="error"/>
    <div v-show="!loading" class="px-2">
        <template v-if="step === 'authenticate'">
            <slot name="before-authentication" />
            <div class="d-flex flex-wrap align-center justify-center">
                <google-signin v-if="authProviders.includes('google') && providers.includes('google')"
                  class="ma-2"
                 :btn="{
                    color: 'white',
                    depressed: true,
                  }"
                @authenticated="getAuth"
                @error="authError">
                    <slot name="google-btn">Continue with Google</slot>
                </google-signin>
                <email-signin v-if="authProviders.includes('email') && providers.includes('email')"
                class="ma-2"
                :btn="{
                    color: 'white',
                    depressed: true,
                  }"
                :redirect-path="continueTo"
                @authenticated="getAuth"
                @error="authError">
                    <slot name="email-btn">Continue with Email</slot>
                </email-signin>
                <phone-signin v-if="authProviders.includes('phone') && providers.includes('phone')"
                  class="ma-2"
                  :btn="{
                    color: 'white',
                    depressed: true,
                  }"
                  @authenticated="getAuth"
                  @error="authError">
                    <slot name="phone-btn">Continue with Phone</slot>
                </phone-signin>

            </div>
        </template>
        <template v-if="step === 'profile-set'">
            <slot name="before-profile-set" />
            <personal-info-form
              flat
              :key="profileComponentKey"
              :form="profileComponentForm"
              @update="f => {
                profileComponentForm = f;
                profileComponentKey++
              }"
              @saved="profileUpdated"
          >
            <template #actions="{ loading, submitting, submit, canSubmit }">
              <v-card-actions class="mt-5">
                <v-spacer></v-spacer>
                <v-btn
                    :loading="submitting"
                    :disabled="loading || !canSubmit"
                    color="primary" depressed
                    @click="submit()"
                >
                  Continue
                </v-btn>
              </v-card-actions>
            </template>
          </personal-info-form>
        </template>
        <template v-if="step === 'id-verification'">
          <slot name="before-id-verification" />
          <id-verification-form
              flat
              :user="profile"
              :verification="profile.id_verification"
              @saved="idVerificationUpdated"
          />
        </template>
        <template v-if="step === 'business-setup'">
          <slot name="before-business-setup" />
          <business-details>
            <template #actions="{ loading, submitting, submit }">
              <v-card-actions>
                <v-btn
                    :loading="submitting"
                    :disabled="loading"
                    color="primary"
                    @click="submit()"
                    depressed block
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </template>
          </business-details>
        </template>
        <template v-if="step === 'property-setup'">
          <slot name="before-property-setup" />
          <business-select
              :items="businesses"
              :value="business ? business.id : null"
              @input="b => business = b"
              label="Business"
              outlined dense
              return-object
              placeholder="Select a business"
              :select-first-as-default="true"
          />
          <business-property-form
              v-if="business"
              flat
              :business="business"
              @property-created="propertyCreated"
          >
            <template #header>
              <v-card-subtitle class="d-none"></v-card-subtitle>
            </template>
            <template #action="{ submitting, submit }">
              <v-card-actions>
                <v-btn
                    :loading="submitting"
                    :disabled="submitting"
                    color="primary"
                    @click="submit()"
                    depressed block
                >
                  Submit
                </v-btn>
              </v-card-actions>
            </template>
          </business-property-form>
        </template>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from 'vuex';

import GoogleSignin from '../Components/GoogleSignin.vue';
import EmailSignin from '../Components/EmailSignin.vue';
import PhoneSignin from '../Components/PhoneSignin.vue';
import profileMixin from '@/domain/User/Mixins/profile';
import formvalidation from '@/helper/formValidation'
import PersonalInfoForm from "@/domain/User/Components/PersonalInfoForm";
import DataContainer from "@/components/DataContainer";
import { auth } from "@/firebase";
import appHelper from "@/helper/app";
import config from "@/config";
import IdVerificationForm from "@/domain/User/Components/IdVerificationForm.vue";
import current_user from "@/domain/User/Mixins/current_user";
import BusinessDetails from "@/domain/User/Widgets/Onboard/BusinessDetails.vue";
import current_business from "@/domain/Business/Mixins/current_business";
import BusinessPropertyForm from "@/domain/Business/Components/BusinessPropertyForm.vue";
import BusinessSelect from "@/domain/Business/Components/BusinessSelect.vue";

export default {
    name: 'MiniAuth',
    components: {
      BusinessSelect,
      BusinessPropertyForm,
      BusinessDetails,
      IdVerificationForm,
      PersonalInfoForm,
      GoogleSignin, EmailSignin,
      PhoneSignin, DataContainer
    },
    mixins: [profileMixin, current_user, current_business ],
    props: {
      continueTo: String,
      idVerificationRequired: Boolean,
      providers: {
            type: Array,
            default: () => ['google', 'email', 'phone']
      },
      mode: String,
    },

    computed: {
      ...mapGetters(['auth', 'authenticated', 'current_user']),
        authProviders() {
          return appHelper.getAuthProviders()
        },
        step(){
          if(!this.authenticated) return 'authenticate';
          if(this.authenticated && !this.profile) return 'profile-set';
          if(this.idVerificationRequired && this.profile) return 'id-verification';
          if(this.mode === 'host') {
            if(!this.businesses.length) return 'business-setup';
            if(!this.properties.length) return 'property-setup'
          }
          return null;
        },
        completed() {
          let completed = this.authenticated && !!this.profile;
          if(this.idVerificationRequired) {
            const verification = this.profile?.id_verification;
            completed = completed && verification?.acceptable
          }
          if(this.mode === 'host') {
            completed = completed && this.business && this.properties.length
          }
          return completed;
        }
    },

    data() {
        return {
            loading: false,
            isProfileSet: false,
            rules: formvalidation.rules,
            error: null,
            profileComponentKey: 1,
            profileComponentForm: null,
            business: null,
            properties: []
        }
    },
    
    methods: {
        ...mapActions([
            'getAuthUserToken',
            'getAuthUserAccount',
            'signout',
        ]),
        ...mapMutations([
            'SET_AUTH',
            'SET_USER_AUTH'
        ]),

      getAuth(){
        this.loading = true;
        if(this.authenticated) {
          this.getAuthUserToken()
          .then(() => this.getAuthUserAccount())
          .catch(e => {
            this.error = e
          })
          .finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      },
      authError(error) {
          this.error = error;
      },
      propertyCreated(property) {
        this.properties.push(property)
      }
    },

    watch: {
      completed: {
        immediate: true,
        handler(c) {
          if(c) this.$emit('completed', c)
        }
      },
      business: {
        immediate: true,
        handler(business) {
          this.properties = business?.properties || []
        }
      }
    },
    created() {
      this.loading = true;
      auth.onAuthStateChanged(user => {
        this.SET_AUTH(user);
        this.getAuth();
      })
      window.addEventListener('message', (message) => {
        const originTest = {
          local: /^http:\/\/localhost:\d*/gm,
          staging: /^https:\/\/staging(.*)\.lodgecompliance\.com/gm,
          production: /^https:\/\/(?!staging)\w*\.lodgecompliance\.com/gm
        }
        if(originTest[config.app.env].test(message.origin)) {
          const { type } = message.data;
          switch (type) {
            case 'get-auth':
              this.getAuth()
              break;
            case 'signout':
              this.signout()
              break;
          }
        }
      });
    }
}
</script>