<template>
  <v-app>
    <v-app-bar app color="white" elevation="0" height="80">
      <v-toolbar-title class="text-center justify-center align-content-center">
        <img class="mt-3" src="@/assets/img/app-logo.png" width="200px"  alt="Lode Compliance"/>
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
    <v-footer v-if="authenticated" app>
      <div v-if="profile">
        <small class="grey--text">
          <span class="mr-3">Signed as</span>
          <profile-avatar size="24" :profile="profile" />
          {{ profile.full_name }}
        </small>
      </div>
      <v-spacer></v-spacer>
      <v-btn
          v-if="authenticated" text color="red"
          depressed small
          @click="signout"
      >
        Signout
      </v-btn>
    </v-footer>
  </v-app>
</template>
<script>
import {mapActions, mapGetters} from "vuex";
import MiniAuth from "@/domain/Auth/Widgets/MiniAuth.vue";
import profileMixin from "@/domain/User/Mixins/profile";
import ProfileAvatar from "@/components/ProfileAvatar.vue";

export default {
  name: 'Auth',
  mixins: [profileMixin],
  components: {
    ProfileAvatar,
    MiniAuth,
  },
  data() {
    return {
      info: null,
    }
  },
  computed: {
    ...mapGetters(['authenticated', 'current_user']),
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
