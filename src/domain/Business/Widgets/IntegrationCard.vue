<template>
  <v-card flat>
    <v-card-title>
      {{ integration.title }}
    </v-card-title>
    <v-card-subtitle>{{ type.name }}</v-card-subtitle>
    <v-card-text>
      <p v-if="type.description">{{ type.description }}</p>
      <v-chip v-for="tag in type.tags" :key="tag" pill small class="ma-1">
        {{ tag }}
      </v-chip>
      <integration-setup
          :open="openSetup"
          :business="business"
          :integration="integration"
          @close="closeSetup"
          @integration-created="closeSetup"
          @integration-updated="closeSetup"
          v-on="$listeners"
      >
        <template #default="{ business, integration, save, saving }">
          <slot name="setup" v-bind="{ business, integration, save, saving, closeSetup }" />
        </template>
      </integration-setup>
    </v-card-text>
    <v-card-actions>
      <item-status v-show="!!integration.id" :status="integration.enabled ? 'enabled' : 'disabled'" />
      <v-spacer></v-spacer>
      <v-btn @click="openSetup = true" color="primary" small depressed>Setup</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import IntegrationSetup from "@/domain/Business/Widgets/IntegrationSetup.vue";
import ItemStatus from "@/components/ItemStatus.vue";

export default {
  name: "IntegrationCard",
  components: {ItemStatus, IntegrationSetup},
  props: {
    business: Object,
    integration: Object
  },
  data() {
    return {
      openSetup: false,
    }
  },
  computed: {
    type() {
      return this.integration?.type;
    }
  },
  methods: {
    closeSetup() {
      this.openSetup = false;
    }
  },
}
</script>