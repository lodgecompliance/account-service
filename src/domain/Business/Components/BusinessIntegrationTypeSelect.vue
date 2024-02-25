<template>
  <div>
    <slot v-bind="{ loading, integrations }">
      <v-autocomplete
        :items="integrations"
        :loading="loading"
        item-text="name"
        item-value="identifier"
        v-bind="$attrs"
        v-on="$listeners"
    >
      <template #selection="{ item: integration, index, select, parent }">
        <v-chip v-if="parent.multiple" pill class="ma-1" close @click:close="parent.value.splice(index, 1)">
          {{ integration.name }}
        </v-chip>
        <template v-else>
          <span>{{ integration.name }}</span>
        </template>
      </template>

      <template #item="{ item: integration, on }">
        <slot name="item" v-bind="{ item: integration, on }">
          <v-list-item v-on="on">
            <v-list-item-content>
              <v-list-item-title>{{ integration.name }}</v-list-item-title>
              <v-list-item-subtitle>{{ integration.description }}</v-list-item-subtitle>
              <div>
                <v-chip v-for="tag in integration.tags" :key="tag" pill small class="ma-1">
                  {{ tag }}
                </v-chip>
              </div>
            </v-list-item-content>
          </v-list-item>
        </slot>
      </template>
    </v-autocomplete>
    </slot>
  </div>
</template>

<script>

import integrations from "@/domain/Business/Mixins/integration";

export default {
  name: "BusinessIntegrationTypeSelect",
  data() {
    return {
      loading: false,
      integrations: []
    }
  },
  mixins: [integrations],
  methods: {
    getIntegrationTypes() {
      this.loading = true;
      this.getBusinessIntegrationTypes().then(integrations => {
        this.integrations = integrations
      }).finally(() => {
        this.loading = false
      })
    }
  },
  mounted() {
    this.getIntegrationTypes();
  }
}
</script>