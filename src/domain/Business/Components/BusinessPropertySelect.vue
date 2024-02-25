<template>
  <v-autocomplete
      :items="itemsToRender"
      item-text="name"
      item-value="id"
      v-bind="$attrs"
      v-on="$listeners"
  >
    <template #selection="{ item: property, index, select, parent }">
      <v-chip v-if="parent.multiple" pill class="ma-1" close @click:close="parent.value.splice(index, 1)">
        {{ property.name }}
      </v-chip>
      <template v-else>
        <span>{{ property.name }}</span>
      </template>
    </template>

    <template #item="{ item: property, on }">
      <slot name="item" v-bind="{ item: property, on }">
        <v-list-item v-on="on">
          <v-list-item-avatar>
            <profile-avatar :profile="property" :size="30" color="accent">
              <template #icon="{ size }">
                <v-icon color="primary" :size="size">mdi-domain</v-icon>
              </template>
            </profile-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ property.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ property.address }}</v-list-item-subtitle>
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
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "BusinessPropertySelect",
  components: { ProfileAvatar },
  mixins: [select],
  data() {
    return {}
  }
}
</script>