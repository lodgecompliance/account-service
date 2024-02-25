<template>
  <v-select
      :items="types"
      item-text="label"
      item-value="value"
      v-bind="$attrs"
      v-on="$listeners"
  >
  </v-select>
</template>

<script>
export default {
  name: "ChartTypeSelect",
  data() {
    return {
      types: [
        {
          label: "Bar",
          value: "bar",
        },
        {
          label: "Line",
          value: "line",
        },
        {
          label: "Radar",
          value: "radar",
        },
        // {
        //   label: "Pie",
        //   value: "pie",
        // },
        // {
        //   label: "Polar Area",
        //   value: "polarArea",
        // },
        // {
        //   label: "Bubble",
        //   value: "bubble",
        // },
      ]
    }
  },
  mounted() {
    this.$emit("input",  this.types[0].value);
  }
}
</script>

