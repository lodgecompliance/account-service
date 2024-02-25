<template>
  <v-sparkline
      :fill="fill"
      :gradient="gradient"
      :line-width="width"
      :padding="padding"
      :smooth="radius || false"
      :labels="showLabel ? Object.keys(groupedData) : undefined"
      :value="Object.values(groupedData)"
      auto-draw
      v-bind="$attrs"
  ></v-sparkline>
</template>
<script>
export default {
  name: "SparkLine",
  data() {
    return { }
  },
  props: {
    groupBy: String,
    valueKey: String,
    gradient: { type: Array },
    fill: { type: Boolean, default: () => true },
    width: { type: Number, default: () => 2 },
    padding: { type: Number, default: () => 5 },
    radius: { type: Number },
    showLabel: { type: Boolean, default: () => false },
    data: { type: Array },
  },

  computed: {
    groupedData() {
      return this.groupData(this.data, this.groupBy, this.valueKey);
    }
  }
}
</script>