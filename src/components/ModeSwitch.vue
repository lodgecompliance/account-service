<template>
  <v-menu v-if="applicableModes.length > 1" offset-y>
    <template v-slot:activator="{ on }">
      <v-list-item v-on="on">
        <v-list-item-avatar :color="currentMode.color" >
          <profile-avatar
              :profile="currentMode.profile"
              size="35"
          />
        </v-list-item-avatar>
        <v-list-item-content v-if="!$vuetify.breakpoint.xsOnly">
          <v-list-item-title>{{ currentMode.title }}</v-list-item-title>
          <v-list-item-subtitle>{{ currentMode.subtitle }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action class="ml-n3">
          <v-icon>mdi-menu-down</v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>
    <v-list>
      <template v-for="mode in applicableModes">
        <v-list-item
            :key="mode.id"
            @click="setMode(mode)"
        >
          <v-list-item-avatar :color="mode.color" >
            <profile-avatar
                :profile="mode.profile"
                size="35"
            />
          </v-list-item-avatar>
          <v-list-item-content class="ml-2">
            <v-list-item-title>{{ mode.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ mode.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </v-menu>
  <v-list-item v-else>
    <v-list-item-avatar :color="currentMode.color" >
      <profile-avatar
          :profile="currentMode.profile"
          size="35"
      />
    </v-list-item-avatar>
    <v-list-item-content v-if="!$vuetify.breakpoint.xsOnly">
      <v-list-item-title>{{ current_user.profile.full_name }}</v-list-item-title>
      <v-list-item-subtitle>{{ currentMode.label }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import {mapGetters, mapMutations} from "vuex";
import current_user from "@/domain/User/Mixins/current_user";
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "ModeSwitch",
  mixins: [current_user],
  components: {ProfileAvatar},
  data() {
    return {}
  },
  computed: {
    ...mapGetters([ 'mode', 'is_admin' ]),

    applicableModes() {
      let modes = [{
        id: 'personal',
        color: "accent",
        title: this.current_user?.profile?.full_name,
        subtitle: "Personal",
        profile: this.current_user?.profile
      }];
      if(this.userBusinesses.length) {
        modes = modes.concat(this.userBusinesses.map( userBusiness => {
          return {
            id: userBusiness.business.id,
            color: "accent",
            title: userBusiness.business.name,
            subtitle: userBusiness.role,
            profile: userBusiness.business
          }
        }))
      }
      // if(this.is_admin) modes.push({
      //   id: "admin",
      //   color: "primary",
      //   title: this.current_user.profile.full_name,
      //   subtitle: this.current_user.admin ?  `Admin (${this.current_user.admin.role})` : 'Admin',
      //   profile: this.current_user.profile
      // })
      return modes;
    },

    currentMode() {
      return this.applicableModes.find(mode => mode.id === this.mode);
    },
  },
  methods: {
    ...mapMutations([ "SET_MODE"]),
    setMode(mode) {
      this.SET_MODE(mode.id);
      if(this.$route.name !== 'home') {
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>
.theme--dark.v-badge .v-badge__badge::after {
  border-color: #FFFFFF !important;
}
</style>