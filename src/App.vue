<template>
  <!-- App.vue -->
  <router-view v-if="$route.name === 'auth'"></router-view>
  <v-app v-else>
    <nav-drawer
        v-if="authenticated && app_ready && app_layout === 'full'"
        @signout="$refs.confirmSignout.open()"
    />
    <v-app-bar
      app
      color="white"
      v-if="app_ready && app_layout === 'full'"
      elevation="0"
    >
      <v-app-bar-nav-icon
          v-if="$vuetify.breakpoint.mobile && authenticated && app_ready && app_layout === 'full'"
          @click="$store.state.navDrawer = !$store.state.navDrawer"
         ></v-app-bar-nav-icon>
        <v-toolbar-title class="black--text">
          <h4>{{ current_page.title || appName }}</h4>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <div class="mr-n6">
          <mode-switch v-if="$store.getters.mode" />
        </div>
    </v-app-bar>

    <!-- Sizes your content based upon application components -->
    <v-main v-if="app_ready">
      <router-view></router-view>
      <div v-if="app_layout === 'plain' && authenticated" class="text-center mb-16">
        <div v-if="auth" >
          <small class="grey--text">signed in as {{ auth.email }}</small>
        </div>
        <v-btn text color="primary" @click="signUserOut" >
          Sign out
        </v-btn>
      </div>
    </v-main>
    <v-main v-else>
      <div  class="d-flex justify-center align-center" style="height: 80vh">
          <div v-if="!error" class="text-center">
              <img src="@/assets/img/app-logo.png" width="200px" class="loader" />
              <p class="grey--text mt-5">{{app_process}}</p>
          </div>
          <div v-else class="text-center">
            <div><v-icon>alert-circle</v-icon></div>
            <p>{{ error }}</p>
            <div v-if="updateExists">
              <h2>This might be due to outdated version, please update the application</h2>
              <v-btn @click="refreshApp()" color="primary" text> Update</v-btn>
            </div>
            <v-btn v-else  @click="setUser()" color="primary" text> Retry</v-btn>
          </div>
      </div>
    </v-main>

    <confirmation-dialog ref="confirmSignout" @confirmed="signUserOut">
      <template #header>
        <v-card-title
            class="justify-center">
          Sign Out
        </v-card-title>
      </template>
      <div class="text-center py-5">
        Are you sure you want to sign out of this account?
      </div>
      <template #footer="{ close, confirm }">
        <v-card-actions class="justify-center">
          <v-btn
              color="primary"
              outlined
              @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
              depressed
              color="primary"
              @click="confirm"
          > Sign out
          </v-btn>
        </v-card-actions>
      </template>
    </confirmation-dialog>

    <v-snackbar v-if="app_layout === 'full'" top right :value="updateExists" :timeout="-1" color="primary">
      <v-row justify="space-around" align="start">
        <v-col cols="9" class="my-0 py-0">
          An update is available
        </v-col>
        <v-col cols="3" class="my-0 py-0">
          <v-btn text small dark @click="refreshApp" >
            Update
          </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>

    <v-footer app>
      <small><a :href="site" class="text-decoration-none">{{ (new Date()).getFullYear() }}. {{ appName }}</a></small>
      <v-spacer></v-spacer>
      <v-btn x-small @click="reloadApp" title="Reload app" icon><v-icon>mdi-refresh</v-icon></v-btn>
    </v-footer>

    <div data-dialog="corner"></div>
  </v-app>

</template>

<script>

import {mapActions, mapMutations, mapGetters} from 'vuex'
import NavDrawer from '@/components/NavDrawer.vue';
import { fb, auth } from './firebase';
import authState from './plugins/auth';
import helper from '@/helper';
import update from './mixins/update';
import config from './config';
import ModeSwitch from "@/components/ModeSwitch";
import ConfirmationDialog from "@/components/Utilities/ConfirmationDialog.vue";
import UserBusinessSwitch from "@/domain/User/Components/UserBusinessSwitch.vue";

export default {
  name: 'App',
  mixins: [update],
  components: {
    ConfirmationDialog,
    //UserBusinessSwitch,
    ModeSwitch,
    NavDrawer
  },
  data(){
    return {
      appName: config.app.name,
      site: config.app.url,
      error: null,
    }
  },

  computed:{
    ...mapGetters([
      'auth',
      'app_ready',
      'app_process',
      'authenticated',
      'app_layout',
      'current_user',
      'current_page',
    ]),
  },

    methods:{

      ...mapActions([
        'getSystemParams',
        'getAuthUserToken',
        'getAuthUserAccount',
        'signout',
        'query',
        'mutate'
      ]),
      
      ...mapMutations([
          'SET_AUTH',
          'SET_APP_STATE',
          'SET_USER_AUTH',
          'SET_USER_PROFILE',
          'SNACKBAR',
          'UNSET_CURRENT_USER',
          'SET_APP_LAYOUT',
          'SET_MODE'
      ]),

      setUser(){
          this.error = null;
          this.SET_APP_STATE(false);
          if(
              window.localStorage.getItem('lc-user')
              && window.localStorage.getItem('token-expires') > helper.nowTimestamp()
              && this.auth
              && this.current_user.profile
          )
          {
            this.SET_APP_STATE(true);
            return;
          }
          else if(!this.auth){
            this.signUserOut()
            return;
          }
          this.getAuthUserToken()
          .then(() => this.getAuthUserAccount())
          .then(() => {
            this.SET_APP_STATE(true)
          })
          .catch(e => {
            console.log("Auth error-->", e)
            this.signUserOut()
          })
      },

      signUserOut(){
        this.SET_APP_STATE(false);
        this.signout()
        .then(() => {
          if(this.$route.name !== 'signin'){
              this.$router.push({ name: 'signin' });
            }
            this.SET_APP_STATE(true);
        })
      },
    },

  created() {
    this.getSystemParams()
  },

  mounted(){
    if (this.$route.name === 'auth') return;
    auth.onAuthStateChanged(user => {
      this.SET_AUTH(user);
      if(!this.app_ready) this.setUser()
    });
  },

    watch: {
      $route: {
        immediate: true,
        handler(route) {
          const plainLayoutRoutes = ["signin", "onboard"];
          this.$store.commit('SET_APP_LAYOUT', plainLayoutRoutes.includes(route.name) ? 'plain' : 'full')
          this.$store.commit('SET_CURRENT_PAGE', { title: route.meta.title  });
        }
      }
    }
}
</script>

<style>
  .theme--light.v-application {
    background-color: #f7f7f7 !important;
  }
   /* .theme--light.v-application {
        background-image: url('./assets/img/signin-bg.png') !important;
        background-position: center center !important;
        background-size: cover !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
    } */
  .required label::after {
    content: "*";
  }

  .loader {
    animation: fadeInfadeOut 1.5s linear 0s infinite;
  }

  .striped tbody tr:nth-of-type(odd),
  .striped .v-virtual-scroll__item:nth-of-type(odd),
  .striped .v-list-item.theme--light:nth-of-type(odd)
  {
    background: #F7FBFF;
  }
  .striped tbody tr:nth-of-type(even),
  .striped .v-virtual-scroll__item:nth-of-type(even),
  .striped .v-list-item.theme--light:nth-of-type(even)
  {
    background: #FFFFFF;
  }

  .theme--light.v-data-table.striped > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row),
  .theme--light.v-data-table.striped > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row)
  {
    border: none;
  }
  .theme--light.v-data-table.striped > .v-data-table__wrapper > table > tbody > tr:nth-of-type(odd):hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
  {
    background: #F7FBFF;
  }
  .theme--light.v-data-table.striped > .v-data-table__wrapper > table > tbody > tr:nth-of-type(even):hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper)
  {
    background: #FFFFFF;
  }

  .v-tabs {
    flex: unset !important;
  }

  @keyframes fadeInfadeOut {
    0% {
      opacity: 0.2;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.2;
    }
  }
  .text-transform-unset {
    text-transform: unset !important;
  }
  .box-shadow-unset {
    box-shadow: unset !important;
    -webkit-box-shadow: unset !important;
  }
  .cursor-pointer {
    cursor: pointer;
  }

  [data-dialog="corner"] .v-dialog__content{
    justify-content: end;
    align-items: stretch;
  }

  [data-dialog="corner"] .dialog-right.v-dialog {
    margin: 0;
    width: 400px;
    max-width: 90%;
    max-height: 100%;
    right: 0;
    left: unset;
    border-radius: 0;
  }

  [data-dialog="corner"] .dialog-right.v-dialog .v-card {
    height: 100%;
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }

  [data-dialog="corner"] .dialog-right.v-dialog .v-card .v-image.v-responsive {
    flex: 0 0 auto !important;
  }

</style>
