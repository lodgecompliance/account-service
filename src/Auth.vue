<template>
  <v-app>
    <v-main>
      <section class="auth-wrapper">
        <div class="auth-wrapper-inner">
          <div class="text-center py-10">
            <img src="@/assets/img/app-logo.png" width="200px"  alt="Lode Compliance"/>
          </div>
          <mini-auth @completed="authCompleted">
            <template #before-authentication>
              <h4 class="text-center">Sign in with one the following options before proceeding</h4>
            </template>
            <template #before-profile-set>
              <h4 class="text-center">Complete your profile</h4>
            </template>
          </mini-auth>
        </div>
      </section>
    </v-main>
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
      this.broadcastAuth()
      if(!this.inFrame && this.$route.query.referer) {
        window.location.replace(this.$route.query.referer);
      }
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
