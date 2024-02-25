<template>
  <v-dialog
      v-bind="$attrs"
      v-on="$listeners"
      width="400"
      attach="[data-dialog='corner']"
      content-class="dialog-right"
      persistent scrollable
  >
    <template v-slot:activator="{ on, attrs }">
      <slot name="activator" v-bind="{ on, attrs }" />
    </template>
    <slot />
  </v-dialog>
</template>

<script>
export default {
  name: "CornerDialog",
}
</script>