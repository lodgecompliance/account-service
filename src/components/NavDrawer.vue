<template>
    <v-navigation-drawer 
      app
      v-model="$store.state.navDrawer"
      color="#F0F1F4"
      :permanent="!$vuetify.breakpoint.mobile"
      >
      <template v-slot:prepend>
        <img
            src="../assets/img/app-logo.png"
            width="80%"
            class="ml-2 mt-3 cursor-pointer"
            @click="$router.push({ name: 'home' })"
        />
        <v-divider></v-divider>
      </template>

      <v-list>
        <v-list-item-group
            v-model="currentNav"
            color="primary"
        >
          <template v-for="(item, i) in navItems">
            <!--     Item with subitem       -->
            <v-list-group
                v-if="item.render && item.subItems && item.subItems.length"
                :key="i"
                :value="$router.currentRoute.name === item.route.name"
                :prepend-icon="item.icon"
                active-class="primary--text"
                no-action
            >
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <v-list-item
                    v-for="(subItem, j) in item.subItems"
                    :key="j"
                    :to="subItem.route"
                    active-class="primary--text"
                >
                  <v-list-item-icon>
                    <v-icon v-text="subItem.icon"></v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-text="subItem.title"></v-list-item-title>
                    <v-list-item-subtitle v-if="subItem.subtitle" v-text="subItem.subtitle"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
            </v-list-group>
            <!--     Single item       -->
            <v-list-item
                :key="i"
                v-else-if="item.render"
                :to="item.route"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-if="item.subtitle" v-text="item.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
          </v-list-item>
            <!--     Disabled nav item       -->
            <v-list-item v-else disabled :key="i">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
                <v-list-item-subtitle v-if="item.subtitle" v-text="item.subtitle"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
      </v-list>

      <template v-slot:append>
        <v-list-item v-if="authenticated" @click="$emit('signout')">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Signout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else @click="$router.push({name: 'signin'})">
          <v-list-item-icon>
            <v-icon>mdi-login</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Sign in</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
</template>

<script>
import config from '@/config'
import auth from '@/mixins/auth'
import { mapGetters } from 'vuex'

export default {
    name: "NavDrawer",
    mixins: [auth],
    data(){
        return {
            appName: config.app.name,
            currentNav: 0
        }
    },
    computed:{
      ...mapGetters([
        'mode',
        'current_user',
        'authenticated',
      ]),

    navItems() {
      return this.mode === 'personal'
          ? this.userItems
          : this.businessItems
    },

    userItems() {
      return [
        {
          title: 'Account',
          icon: 'mdi-account',
          route: { name: 'user.profile' },
          render: true,
          router: true,
        },
        {
          title: 'ID Verification',
          icon: 'mdi-account-check',
          route: { name: 'user.id.verification' },
          render: true,
          router: true,
        },
        {
          title: 'Businesses',
          icon: 'mdi-briefcase-account',
          route: { name: 'user.businesses' },
          render: true,
          router: true,
        },
        {
          title: 'Wallets',
          icon: 'mdi-wallet',
          route: { name: 'user.wallets' },
          render: true,
          router: true,
        }
      ]
    },

    businessItems() {
      return [
        {
          title: 'Profile',
          icon: 'mdi-account',
          route: { name: 'business.profile', params: { business: this.mode } },
          render: true,
          router: true,
        },
        {
          title: 'Users',
          icon: 'mdi-account-group',
          route: { name: 'business.users', params: { business: this.mode } },
          render: true,
          router: true,
        },
        {
          title: 'Integrations',
          icon: 'mdi-cog-box',
          route: { name: 'business.integrations', params: { business: this.mode } },
          render: true,
          router: true,
        },
        {
          title: 'Properties',
          icon: 'mdi-domain',
          route: { name: 'business.properties', params: { business: this.mode } },
          render: true,
          router: true,
        },
        {
          title: 'Wallets',
          icon: 'mdi-wallet',
          route: { name: 'business.wallets', params: { business: this.mode } },
          render: true,
          router: true,
        },
        {
          title: 'Billing',
          icon: 'mdi-credit-card',
          route: { name: 'business.billing', params: { business: this.mode } },
          render: true,
          router: true,
        },
      ]
    },
  },
  watch: {
      $route: {
        immediate: true,
        handler(route) {
           this.currentNav = this.navItems.findIndex(item => route.name.startsWith(item.route.name));
        }
      }
  }
}
</script>

<style scoped>
  .no-underline-nav-link{
    text-decoration: none !important;
  }
</style>