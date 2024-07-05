<template>
    <app-layer ref="app" color="#D7D7D7">
      <v-row justify="center" style="min-height: 50vh" class="pt-16" >
        <v-col cols="12" sm="8" md="6">
          <data-container
            :loading="loading"
            :error="error"
            :can-retry="true"
            @retry="getPendingUser"
          >
            <template v-if="pendingUser">
              <template v-if="authUserMatchPendingUser">
                <div class="text-center">
                  <p>{{ pendingUser.first_name }}, kindly complete your onboarding process</p>
                </div>
                <user-on-board :pending-user="pendingUser" @completed="onBoarded" />
              </template>
              <template v-else>
                <v-alert colored-border border="left" type="primary" class="mt-10">
                  You need to authenticate with email: <strong>{{ pendingUser.email | nullable }}</strong> or phone: <strong>{{ pendingUser.phone | nullable }}</strong>
                  to complete your onboarding
                </v-alert>
              </template>
            </template>
            <user-on-board v-else @completed="onBoarded" />
          </data-container>
        </v-col>
      </v-row>
    </app-layer>
</template>

<script>
    import AppLayer from '@/AppLayer';
    import UserOnBoard from "../Widgets/Onboard/Index";
    import user from "@/domain/User/Mixins/user";
    import DataContainer from "@/components/DataContainer";
    import auth from "@/mixins/auth";

    export default {
        name: 'OnBoardPage',
        mixins: [user, auth],
        components:{
          DataContainer,
           AppLayer, UserOnBoard
        },
        data(){
            return {
              loading: false,
              error: null,
              pendingUser: null
            };
        },

        computed: {
            pendingUserId() {
              return this.$route.params.pendingUserId
            },
            authUserMatchPendingUser() {
                if(!this.pendingUser) return false;
                return this.currentUserAuth.email === this.pendingUser.email
                    || this.currentUserAuth.phoneNumber?.replace(/\s+/g, "") === this.pendingUser.phone?.replace(/\s+/g, "")
            }
        },

        methods: {
          onBoarded() {
            this.$router.push(this.$route.query.redirect
                ? { path: this.$route.query.redirect }
                : { name: "home" }
            );
          },
          getPendingUser() {
            this.loading = true;
            this.error = null;
            this.getUserById(this.pendingUserId, true)
                .then(user => {
                  this.pendingUser = user
                })
                .catch(e => {
                  this.error = e
                })
                .finally(() =>{
                  this.loading = false
                })
          }
        },
      watch: {
        pendingUserId: {
          immediate: true,
          handler(id) {
            if(id) this.getPendingUser()
          }
        }
      }
    }
</script>
<style>

</style>
