<template>
  <v-tabs :vertical="!$vuetify.breakpoint.mobile" v-bind="$attrs" v-on="$listeners">
    <slot name="tabs" />
    <slot name="items" />
  </v-tabs>
</template>

<script>

import {mapGetters} from "vuex";

export default {
  name: "ResponsiveTabs",
  data() {
    return {
      vertical: false
    }
  },
  computed: {
    ...mapGetters([])
  },

  watch: {

  }
}
</script>