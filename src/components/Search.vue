<template>
  <v-text-field
      prepend-inner-icon="mdi-magnify"
      label="Search"
      flat solo dense
      hide-details="auto"
      v-bind="$attrs"
      v-on="$listeners"
  >
    <template #append>
      <v-btn text small color="primary">
        <v-icon>mdi-filter-outline</v-icon>
        <span class="d-none d-md-inline">Filter</span>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: "SearchField"
}
</script>