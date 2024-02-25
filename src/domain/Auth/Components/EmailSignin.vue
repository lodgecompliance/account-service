<template>
    <div>
        <v-btn
            v-bind="$attrs.btn"
            @click="start = true">
          <span><v-icon class="mr-5">mdi-email</v-icon> <slot>Signin with Email</slot></span>
          <slot name="btn-append"/>
        </v-btn>
        <v-dialog v-model="start"
        max-width="600" persistent>
            <v-card :loading="loading">
                <v-card-text class="py-10">
                  <v-row justify="center">
                    <v-col cols="12" md="8">
                      <div class="text-center mb-10">
                        <h1 class="black--text">Sign in with Email</h1>
                        <p class="grey--text mt-2" v-if="!linkSent">Please provide your email address below to continue.</p>
                      </div>
                      <div class="text-center" v-if="linkSent" >
                        <p><v-icon color="primary">mdi-information-outline</v-icon> A link has been sent to {{ email }}</p>
                        <a href="#" @click.prevent="linkSent = false" class="text-decoration-none">Change email</a>
                      </div>
                      <v-form v-else ref="form" >
                        <v-text-field
                            outlined
                            dense
                            type="email"
                            v-model="email"
                            label="Email"
                            :rules="[rules.required, rules.email]"
                            hide-details="auto"
                            placeholder="Enter an email address"
                        ></v-text-field>
                      </v-form>
                      <div class="mt-8">
                        <v-btn color="red" text @click="cancel">Cancel</v-btn>
                        <v-btn
                            color="primary"
                            class="ml-5"
                            @click="signin"
                            :loading="loading"
                            :disabled="linkSent"
                            depressed
                        >Continue</v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
import { auth } from '../../../firebase';
import validation from '@/helper/formValidation';

export default {
    name: "EmailSignin",
    props: {
        redirectPath: String
    },
    data(){
        return {
           email: '',
           rules: validation.rules,
           loading: false,
           linkSent: false,
           start: false,
        }
    },

    computed:{
        verificationRoute(){
            return this.url( this.redirectPath ? this.redirectPath : this.$router.resolve(this.$route).route.fullPath )
        },
    },
    
    methods: {
        signin() {
            if(!this.$refs.form.validate()) return;
            this.loading = true;
            let actionCodeSettings = {
                url: this.verificationRoute,
                handleCodeInApp: true,
            };
            auth.sendSignInLinkToEmail(this.email, actionCodeSettings)
            .then(() => {
                this.linkSent = true;
                window.localStorage.setItem('emailForSignIn', this.email);
            })
            .catch(error => {
                this.$emit('error', error);
                this.start = false;
            })
            .finally(() => {
                this.loading = false;
            });
        },
        cancel() {
          this.linkSent = false;
          this.loading = false;
          this.$refs.form.reset();
          this.start = false;
        }
    },

    mounted() {
        if (auth.isSignInWithEmailLink(window.location.href) && !auth.currentUser) {
            var email = window.localStorage.getItem('emailForSignIn');
            if (!email) {
                email = window.prompt('Please provide your email for confirmation');
            }
            if(email) {
                auth.signInWithEmailLink(email, window.location.href)
                .then((result) => {
                    window.localStorage.removeItem('emailForSignIn');
                    this.$emit('authenticated', {
                        user: result.user,
                        provider: 'email'
                    });
                })
                .catch(error => {
                    this.$emit('error', error)
                })
                .finally(() => {

                })
            }
        }
    }

}
</script>