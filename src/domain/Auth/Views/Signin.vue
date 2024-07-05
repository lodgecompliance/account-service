<template>
    <app-layer ref="app" color="#D7D7D7">
      <v-row justify="center" style="min-height: 50vh" class="pt-16" >
        <v-col cols="12" sm="8" md="6" lg="4">
          <v-sheet class="pa-md-15 pa-5" color="white" rounded>
            <div class="text-center mb-10">
              <h1>Let's get started</h1>
              <p class="grey--text text-subtitle-2">Get started with the app by using any of the options</p>
            </div>
            <v-alert v-if="alert"
                     colored-border border="left"
                     :type="alert.type"
            >
              {{ alert.text }}
            </v-alert>
            <google-signin v-if="providers.includes('google')"
                           class="my-2"
                           :btn="{
                  depressed: true,
                  block: true,
                  outlined: true,
                  large: true,
                  class: 'justify-space-between text-transform-unset'
                }"
                           @authenticated="authenticated"
                           @error="authError"
            >
              Continue with Google
              <template #btn-append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </google-signin>
            <email-signin v-if="providers.includes('email')"
                          class="my-2"
                          :btn="{
                  depressed: true,
                  block: true,
                  outlined: true,
                  large: true,
                  class: 'justify-space-between text-transform-unset'
                }"
                          @authenticated="authenticated"
                          @error="authError"
            >
              Continue with Email
              <template #btn-append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </email-signin>
            <phone-signin v-if="providers.includes('phone')"
                          class="my-2"
                          :btn="{
                    depressed: true,
                    block: true,
                    outlined: true,
                    large: true,
                    class: 'justify-space-between text-transform-unset'
                  }"
                          @authenticated="authenticated"
                          @error="authError"
            >
              Continue with Phone
              <template #btn-append>
                <v-icon>mdi-chevron-right</v-icon>
              </template>
            </phone-signin>
          </v-sheet>
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import AppLayer from '@/AppLayer';
    import GoogleSignin from '../Components/GoogleSignin.vue';
    import EmailSignin from '../Components/EmailSignin.vue';
    import PhoneSignin from '../Components/PhoneSignin.vue'

    export default {
        name: 'Signin',
        components:{
           AppLayer, GoogleSignin, EmailSignin, PhoneSignin
        },
        data(){
            return {};
        },

        computed: {
            redirect(){
                return this.$route.query.redirect ? this.$route.query.redirect : '/'
            },

            redirectUrl(){
                return  this.url(this.$router.resolve({path: this.redirect}).route.fullPath)
            },

            alert(){
                return this.$route.params.alert
            },

            providers(){
                if(this.$route.query.providers) return this.$route.query.providers.split(',')
                return ['google', 'email', 'phone'];
            }
        },

        methods: {
            authenticated(auth) {
                if(auth.user) {
                  this.$store.dispatch('getAuthUserToken')
                    .then(() => {
                        window.location.replace(this.redirectUrl);
                    })
                    .catch(e => {
                      this.authError(e)
                    })
                }
                else if(auth.provider) {
                  this.$store.commit('SNACKBAR', {
                    status: true,
                    text: `Ooops! Authentication via ${auth.provider} was not successful, try again`,
                    color: 'error',
                  })
                }
            },
            authError(error) {
                console.log('Authentication error--->', error);
                this.$store.commit('SNACKBAR', {
                    status: true,
                    text: error.message, 
                    color: 'error',
                })
            }
        }
    }
</script>
<style>

</style>
