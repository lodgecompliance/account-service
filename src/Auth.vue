<template>
  <v-app>
    <v-app-bar app color="white" elevation="0">
      <v-toolbar-title class="text-center justify-center">
        <img src="@/assets/img/app-logo.png" width="200px"  alt="Lode Compliance"/>
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-row justify="center">
        <v-col cols="12" md="6" lg="4" class="auth-wrapper-inner">
          <mini-auth
                  :id-verification-required="['true', '1'].includes($route.query.idVerification)"
                  :mode="$route.query.mode"
                  @completed="authCompleted">
                <template #before-authentication>
                  <h4 class="text-center">Sign in with one the following options before proceeding</h4>
                </template>
                <template #before-profile-set>
                  <h4 class="text-center headline">Complete your profile</h4>
                </template>
                <template #before-id-verification>
                  <h4 class="text-center headline">Complete ID verification</h4>
                </template>
                <template #before-business-setup>
                  <h4 class="text-center headline">Setup a Business</h4>
                </template>
                <template #before-property-setup>
                  <h4 class="text-center headline">Setup a Property</h4>
                </template>
              </mini-auth>
        </v-col>
      </v-row>
    </v-main>
<!--    <v-footer app></v-footer>-->
  </v-app>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import MiniAuth from "@/domain/Auth/Widgets/MiniAuth.vue";

export default {
  name: 'Auth',
  components: {
    MiniAuth,
  },
  data() {
    return {
      info: null,
    }
  },
  computed: {
    ...mapGetters(['current_user']),
    inFrame() {
      return  window.self !== window.top
    }
  },
  methods:{
    ...mapActions([
        "broadcast",
        "broadcastAuth",
        "signout",
    ]),

    authCompleted(authenticated) {
      if(this.inFrame) this.broadcastAuth()
      else if(this.$route.query.referrer) window.location.replace(this.$route.query.referrer)
    },
  },
}
</script>

<style>
  .auth-wrapper {
    height: 100%;
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
