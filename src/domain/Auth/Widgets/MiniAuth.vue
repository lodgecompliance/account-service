<template>
  <div>
    <data-container :loading="loading" :error="error"/>
    <div v-show="!loading">
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
    </div>
    <div v-if="authenticated" class="text-center mt-5">
      <div v-if="profile">
        <small class="grey--text">Authenticated as</small>
        <p>{{ profile.full_name }}</p>
      </div>
      <v-btn v-if="completed"
             color="primary"
             depressed small
             @click="$emit('completed', true)">
        Continue
      </v-btn>
      <v-btn v-if="authenticated" text color="red"
             depressed small
             @click="signout">
        Signout
      </v-btn>
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

export default {
    name: 'MiniAuth',
    components: {
      IdVerificationForm,
      PersonalInfoForm,
      GoogleSignin, EmailSignin,
      PhoneSignin, DataContainer
    },
    mixins: [profileMixin, current_user],
    props: {
      continueTo: String,
      idVerificationRequired: Boolean,
      providers: {
            type: Array,
            default: () => ['google', 'email', 'phone']
        }
    },

    computed: {
      ...mapGetters(['auth', 'authenticated', 'current_user']),
        authProviders() {
          return appHelper.getAuthProviders()
        },
        step() {
          if(!this.authenticated) return 'authenticate';
          if(this.authenticated && !this.profile) return 'profile-set';
          if(this.idVerificationRequired && this.profile) return 'id-verification';
          return null;
        },
        completed() {
          let completed = this.authenticated && !!this.profile;
          if(this.idVerificationRequired) {
            const verification = this.profile?.id_verification;
            completed = completed
                && (verification?.[verification.provider]?.verified || verification?.manually_completed)
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

      profileCompleted() {
      },

    },

  watch: {
      completed: {
        immediate: true,
        handler(c) {
          if(c) this.$emit('completed', c)
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
              console.log('gonna signout')
              this.signout()
              break;
          }
        }
      });
    }
}
</script>