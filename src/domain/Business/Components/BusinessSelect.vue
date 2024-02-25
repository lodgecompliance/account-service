<template>
  <v-autocomplete
      :items="items"
      item-text="name"
      item-value="id"
      v-bind="$attrs"
      v-on="$listeners"
  >
    <template #selection="{ item: business, index, select, parent }">
      <v-chip v-if="parent.multiple" pill class="ma-1" close @click:close="parent.value.splice(index, 1)">
        {{ business.name }}
      </v-chip>
      <template v-else>
        <span>{{ business.name }}</span>
      </template>
    </template>

    <template #item="{ item: business, on }">
      <slot name="item" v-bind="{ item: business, on }">
        <v-list-item v-on="on" :disabled="allowOnlyEnabled && business.status !== 'enabled'">
          <v-list-item-avatar>
            <profile-avatar :profile="business" :size="30" color="accent">
              <template #icon="{ size }">
                <v-icon color="primary" :size="size">mdi-briefcase-account</v-icon>
              </template>
            </profile-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ business.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ business.address }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </slot>
    </template>
  </v-autocomplete>
</template>

<script>

import select from "@/mixins/select";
import ProfileAvatar from "@/components/ProfileAvatar";

export default {
  name: "BusinessSelect",
  components: {ProfileAvatar},
  mixins: [select],
  data() {
    return {}
  },
  props: {
    allowOnlyEnabled: {
      default: () => true
    }
  }
}
</script>