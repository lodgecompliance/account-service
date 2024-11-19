<template>
    <div>
        <v-btn v-bind="$attrs.btn" @click="start = true">
          <span><v-icon class="mr-5">mdi-phone</v-icon> <slot>Signin with phone number</slot></span>
          <slot name="btn-append"/>
        </v-btn>
        <v-dialog
        v-model="start" 
        max-width="600"
        persistent
        scrollable
        >
            <v-card :loading="loading">
                <v-card-text class="py-10">
                  <v-row justify="center">
                    <v-col cols="12" md="8">
                      <div class="text-center mb-10">
                        <h1 class="black--text">Sign in with Phone</h1>
                        <p class="grey--text mt-2" v-if="!verificationSent">Please provide your phone number below to continue.</p>
                      </div>
                      <template v-if="!verificationSent">
                        <phone-number v-model="phone" dense outlined />
                      </template>
                      <template v-else>
                        <div class="d-flex justify-center">
                          <v-icon color="primary">mdi-information-outline</v-icon>
                          <p class="ml-2">
                            We sent a one time validation code to {{ phone.international }}. Enter the 6 digit code below before it expires
                          </p>
                        </div>

                        <div class="my-5">
                          <v-form ref="confirmVerification" >
                            <v-text-field
                                dense
                                outlined
                                v-model="verificationCode"
                                label="Verification code"
                                :rules="[rules.required]"
                                hide-details="auto" ></v-text-field>
                          </v-form>
                        </div>
                        <div class="text-center">
                          <a href="#" @click.prevent="resendVerificationCode" class="text-decoration-none">Resend/change number</a>
                        </div>
                      </template>
                      <div class="mt-8">
                        <v-btn color="red" text @click="cancel">Cancel</v-btn>
                        <v-btn
                            v-if="!verificationSent"
                            color="primary"
                            class="ml-5"
                            @click="sendVerificationCode"
                            :loading="loading"
                            depressed
                        >Continue</v-btn>
                        <v-btn
                            v-else
                            color="primary"
                            class="ml-5"
                            @click="confirmVerificationCode"
                            :loading="loading"
                            depressed
                        >Verify</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
        <div id="phone-recaptcha-container"></div>
    </div>
</template>
<script>
import {fb, auth} from '../../../firebase';
import validation from '@/helper/formValidation';
import PhoneNumber from '@/components/Utilities/PhoneNumber';

export default {
    name: "PhoneSignin",
    components: {
        PhoneNumber
    },
    props: {

    },
    data(){
        return {
            start: false,
            loading: false,
            rules: validation.rules,
            phone: {},
            verificationSent: false,
            verificationCode: '',
            reCaptchaSolved: false,
            reCaptchaRendered: false,
            appVerifier: null,
        }
    },

    methods: {
        sendVerificationCode(){

            if(!this.phone.valid){
                this.$emit('error', {
                    message: 'Invalid phone',
                })
               this.start = false;
              return;
            }

            this.loading = true;
            const appVerifier = window.recaptchaVerifierPhone;
            auth.signInWithPhoneNumber(this.phone.international, appVerifier)
            .then(confirmationResult => {
                window.confirmationResult = confirmationResult;
                this.verificationSent = true;
            })
            .catch(e => {
                // Reset recaptcha state
                window.recaptchaVerifierPhone.render().then(function(widgetId) {
                    appVerifier.reset(widgetId);
                });
                this.$emit('error', e);
                this.start = false;
            })
            .finally(() => {
                this.loading = false;
            })
        },

        resendVerificationCode(){
            window.confirmationResult = null;
            window.recaptchaVerifier = null;
            this.verificationSent = false;
        },

        confirmVerificationCode(){
            if(!this.$refs.confirmVerification.validate()) {
                this.$emit('error', {
                    message: 'Input not filled correctly',
                });
                return;
            }

            this.loading = true;

            window.confirmationResult.confirm(this.verificationCode)
            .then(result => {
                if(result.user) this.$emit('authenticated', {
                    user: result.user,
                    provider: 'phone'
                });
            })
            .catch( e => {
                if(e.code === 'auth/credential-already-in-use'){
                    this.$emit('error', {
                        message: 'Phone number already in use by another user',
                    })
                }else{
                    this.$emit('error', {
                        message: e.message,
                    })
                }
              this.start = false;
              this.resendVerificationCode()
            })
            .finally(() => {
                this.loading = false;
            })
        },

        mountRecaptcha() {
            if (document.getElementById('phone-recaptcha-container')) {
                    window.recaptchaVerifierPhone = new fb.auth.RecaptchaVerifier("phone-recaptcha-container", {
                    'size': 'invisible',
                    'callback': (response) => {
                        this.reCaptchaSolved = true;
                    },
                    'expired-callback': () => {
                        this.$emit('error', {
                            message: 'reCaptcha expired',
                        });
                    }
                });

                window.recaptchaVerifierPhone.render().then(function(widgetId) {
                    window.recaptchaWidgetPhoneId = widgetId;
                });
                
            } else {
                console.log("ReCaptcha container is not available");
            }
        },

        cancel() {
          window.confirmationResult = null;
          window.recaptchaVerifier = null;
          this.verificationSent = false;
          this.loading = false;
          this.phone = {};
          this.start = false;
        }
    },

    mounted() {
        setTimeout(() => {
            this.mountRecaptcha();
        }, 1000);
    },

}
</script>