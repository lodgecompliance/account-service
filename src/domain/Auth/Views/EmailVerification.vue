<template>
    <app-layer ref="app">
        <v-row justify="center" class="mt-5">
            <v-col cols="12" md="4">
                <error-handler :error="error" />
                <v-card flat
                :loading="loading"
                v-if="!emailForConnect"
                >
                    <v-card-title>
                        <h1 class="headline">Confirm your new email</h1>
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="emailVerification" >
                        <v-text-field
                            outlined
                            v-model="email"
                            label="Email"
                            :rules="[rules.required, rules.email]"
                            dense></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                            text
                            dark color="accent-4"
                            class="primary"
                            block
                            @click="verifyEmail"
                            :loading="loading"
                        >
                            Verify
                        </v-btn>
                    </v-card-actions>
                </v-card>
                <v-card flat v-else-if="confirmGoogleDisconnect">
                  <v-card-text>
                     <v-alert
                         colored-border border="left"
                        type="warning"
                    >
                        You are about to link the email address {{ email }} to your account,
                        The Google account with email {{ googleProvider.email }} will be disconnected
                    </v-alert>
                </v-card-text>
                  <v-card-actions>
                    <v-btn
                        text
                        dark color="accent-4"
                        class="primary"
                        block
                        @click="verify"
                        :loading="loading"
                    >
                        Agree, continue
                    </v-btn>
                </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </app-layer>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { fb, auth } from '@/firebase';
    import AppLayer from '@/AppLayer';
    import profile from '../../User/Mixins/profile';
    import ErrorHandler from "@/components/ErrorHandler";

    export default {
        name: "EmailVerification",
        mixins: [profile],

        data(){
            return {
                confirmGoogleDisconnect: false,
                error: null,
                email: null,
            }
        },
        components: {
          ErrorHandler,
          AppLayer
        },
        computed:{
            ...mapGetters([
                'app_ready',
            ]),

            returnPath(){
                return this.$router.resolve({name: this.$route.name, query: this.$route.query }).route.fullPath
            },
            emailForConnect(){
              return window.localStorage.getItem('emailForConnect')
          }
        },
        methods: {
            verify() {
            const pendingEmailConfirmation = (this.current_user?.profile?.metadata || [])
                .find( meta => meta.key === "pending_email_confirmation" )
                if(!pendingEmailConfirmation) {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `There is no pending email confirmation for your account`,
                        color: 'error'
                    })
                    return;
                }
              console.log(pendingEmailConfirmation, this.email);
               if(pendingEmailConfirmation.value !== this.email)
                {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Email address does not match pending confirmation email`,
                        color: 'error'
                    })
                    return;
                }
                this.loading = true;
                this.unlinkOldEmail()
                .then(() => {
                    const credential = fb.auth.EmailAuthProvider.credentialWithLink(this.email, window.location.href);
                    return auth.currentUser.linkWithCredential(credential)
                })
                  .then(() => this.unlinkGoogle())
                .then(() => auth.currentUser.reload() )
                .then(() => {
                    this.$store.commit("SNACKBAR", {
                        status: true,
                        text: `Email address verified successfully`,
                        color: 'success'
                    })
                    return this.syncProfile({ email: this.email });
                })
               .then(() => {
                 window.localStorage.removeItem('emailForConnect')
                 this.$router.push(this.$route.query.redirect
                     ? { path: this.$route.query.redirect }
                     : {
                         name: 'account',
                         params: {
                           tab: 'authentication'
                         }
                      })
               })
                .catch(e => {
                    this.error = e;
                })
                .finally(() => {
                    this.loading = false;
                })
            },

            unlinkOldEmail(){
                if(this.emailProvider) return this.disconnectProvider(this.emailProvider.providerId);
                else return Promise.resolve();
            }, 

            unlinkGoogle(){
                if(this.googleProvider && this.googleProvider.email && this.googleProvider.email !== this.email){
                  return this.disconnectProvider(this.googleProvider.providerId)
                }
                else return Promise.resolve();
            },
           
            verifyEmail(){
                if(this.$refs.emailVerification.validate()){
                    if(this.googleProvider) this.confirmGoogleDisconnect = true;
                    else this.verify();
                }
            },

        },

        watch: {
            app_ready: {
                immediate: true,
                handler(ready){
                    if(!ready) return;
                    if(!auth.currentUser)
                    {
                        this.$router.push({
                            name: 'signin',
                            query: {
                                redirect: this.returnPath
                            },
                            params: {
                                alert: {
                                    type: 'info',
                                    text: 'You need to signin first with your old credentials to continue your Email verification.'
                                }
                            }
                        })
                        return;
                    }
                    if(auth.isSignInWithEmailLink(window.location.href)) {
                        this.email = this.emailForConnect
                        if(this.googleProvider) this.confirmGoogleDisconnect = true;
                        else if(this.email) this.verify();
                    } else{
                        this.$router.push({ name: 'account' })
                    }
                }
            }
        }
    }
</script>


