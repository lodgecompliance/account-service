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
import current_business from "@/domain/Business/Mixins/current_business";
export default {
  name: "BusinessOnboardingList",
  mixins: [current_business],
  data() {
    return {
      loading: false,
      error: null,
    }
  },
  computed: {
    items() {
      return this.currentBusiness?.onboarding || []
    },
    itemsComponents(){
      return {
        'create-property': {
          icon: 'mdi-domain',
          route: { name: 'business.properties', params: { business: this.currentBusiness.id }, query: { action: 'add-new' } }
        },
        'add-integration': {
          icon: 'mdi-cog-box',
          route: { name: 'business.integrations', params: { business: this.currentBusiness.id }, query: { action: 'add-new' } }
        },
        'billing': {
          icon: 'mdi-credit-card',
          route: { name: 'business.billing', params: { business: this.currentBusiness.id }, query: { action: 'add-new' } }
        }
      }
    }
  },
}
</script>