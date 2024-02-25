<template>
  <v-autocomplete
      :items="items"
      item-text="full_name"
      item-value="id"
      v-bind="$attrs"
      v-on="$listeners"
  >
    <template #selection="{ item: user, index, select, parent }">
      <v-chip v-if="parent.multiple" pill class="ma-1" close @click:close="parent.value.splice(index, 1)">
        <profile-avatar :profile="user" :size="30"  left/>
        <span class="ml-2">{{ user.full_name }}</span>
      </v-chip>
      <template v-else>
        <profile-avatar :profile="user" :size="30" color="accent" left/>
        <span class="ml-2">{{ user.full_name }}</span>
      </template>
    </template>
    <template #item="{ item: user, on }">
      <slot name="item" v-bind="{ item: user, on }">
        <v-list-item v-on="on" :disabled="user.status !== 'enabled'">
          <v-list-item-avatar>
            <profile-avatar :profile="user" :size="30" color="accent" />
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ user.full_name }}</v-list-item-title>
            <v-list-item-subtitle><span class="text-capitalize">{{ user.account_type }}</span></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </slot>
    </template>
  </v-autocomplete>
</template>

<script>
import ProfileAvatar from "@/components/ProfileAvatar";
import select from "@/mixins/select";
export default {
  name: "UserSelect",
  mixins: [select],
  components: {ProfileAvatar},
  data() {
    return {}
  }
}
</script>