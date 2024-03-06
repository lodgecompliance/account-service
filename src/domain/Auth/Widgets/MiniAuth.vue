<template>
  <div>
    <data-container :loading="loading" :error="error"/>
    <div v-show="!loading">
        <template v-if="!authenticated">
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
        <template v-else-if="!isProfileSet">
            <slot name="before-profile-set" />
            <personal-info-form
              flat
              :key="profileComponentKey"
              :form="profileComponentForm"
              @update="f => {
                profileComponentForm = f;
                profileComponentKey++
              }"
              @saved="profileCompleted"
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
    </div>
    <div v-if="authenticated && isProfileSet" class="text-center">
      <h4 class="grey--text">Authenticated as</h4>
      <small>{{ current_user.profile.full_name }}</small>
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

export default {
    name: 'MiniAuth',
    components: {
      PersonalInfoForm,
        GoogleSignin, EmailSignin, PhoneSignin, DataContainer
    },
    mixins: [profileMixin],
    props: {
        continueTo: String,
        providers: {
            type: Array,
            default: () => ['google', 'email', 'phone']
        }
    },

    computed: {
      ...mapGetters(['auth', 'authenticated', 'current_user']),
        authProviders() {
          return appHelper.getAuthProviders()
        }
    },

    data() {
        return {
            loading: false,
            isProfileSet: false,
            rules: formvalidation.rules,
            error: null,
            profileComponentKey: 1,
            profileComponentForm: null
        }
    },
    
    methods: {
        ...mapActions([
            'getAuthUserToken',
            'getAuthUserAccount',
            'signout',
            'broadcastAuth'
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
          .then(() => {
            this.isProfileSet = !!this.current_user.profile;
            if(this.isProfileSet) this.$emit('completed', true);
          })
          .catch(e => {
            this.error = e
          })
          .finally(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          this.isProfileSet = false;
        }
      },

      authError(error) {
          this.error = error;
      },

      profileCompleted() {
        this.isProfileSet = true;
        this.broadcastAuth();
        this.$emit("completed", true);
      },

      signUserOut() {
        this.signout()
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
              this.signUserOut()
              break;
          }
        }
      });
    }
}
</script>