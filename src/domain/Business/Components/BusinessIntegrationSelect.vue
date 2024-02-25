<template>
  <v-autocomplete
      :items="itemsToRender"
      item-text="title"
      :item-value="$attrs['item-value'] || 'id'"
      v-bind="$attrs"
      v-on="$listeners"
  >
    <template #selection="{ item: integration, index, select, parent }">
      <v-chip v-if="parent.multiple" pill class="ma-1" close @click:close="parent.value.splice(index, 1)">
        {{ integration.title }} - {{ integration.type.name }}
      </v-chip>
      <template v-else>
        <span>{{ integration.title }} - {{ integration.type.name }}</span>
      </template>
    </template>

    <template #item="{ item: integration, on }">
      <slot name="item" v-bind="{ item: integration, on }">
        <v-list-item v-on="on">
          <v-list-item-content>
            <v-list-item-title>{{ integration.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ integration.type.name }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </slot>
    </template>
    <template #append>
      <slot name="append" />
    </template>
  </v-autocomplete>
</template>

<script>

import select from "@/mixins/select";
export default {
  name: "BusinessIntegrationSelect",
  components: { },
  mixins: [select],
  data() {
    return {}
  }
}
</script>