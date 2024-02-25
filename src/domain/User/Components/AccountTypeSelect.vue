<template>
  <v-select
      :items="accountTypes"
      item-value="value"
      item-text="label"
      v-bind="$attrs"
      v-on="$listeners"
  >
  </v-select>
</template>
<script>
import select from "@/mixins/select";

export default {
  name: "UserAccountTypeSelect",
  mixins: [select],
  data() {
    return {
      accountTypes: [
        {
          label: "Individual",
          value: 'individual'
        },
        {
          label: "Business",
          value: 'business'
        }
      ]
    }
  }
}
</script>