<template>
  <section>
    <v-card
        flat outlined
        v-for="(item, i) in items"
        :key="i"
        :to="itemsComponents[item.id].route"
        class="my-2"
        :disabled="item.completed"
    >
      <v-card-title class="d-flex">
        <h4>{{ item.title }}</h4>
        <v-spacer></v-spacer>
        <v-icon v-if="item.completed" color="primary" size="40">mdi-check</v-icon>
        <v-icon v-else color="warning" size="40">mdi-alert</v-icon>
      </v-card-title>
      <v-card-text v-text="item.description"></v-card-text>
    </v-card>
  </section>
</template>

<script>
import current_user from "@/domain/User/Mixins/current_user";
export default {
  name: "UserOnboardingList",
  mixins: [current_user],
  data() {
    return {
      loading: false,
      error: null,
    }
  },
  computed: {
    items() {
      return this.profile?.onboarding || []
    },
    itemsComponents(){
      return {
        'create-business': {
          icon: 'mdi-briefcase-account',
          route: { name: 'user.businesses', query: { action: 'create-new' } }
        },
        'id-verification': {
          icon: 'mdi-account-check',
          route: { name: 'user.id.verification' }
        }
      }
    }
  },
}
</script>