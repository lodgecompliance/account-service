<template>
  <v-virtual-scroll
     :items="items"
     :height="computedHeight"
     :item-height="itemHeight"
  >
    <template #default="{ item, index }">
      <slot v-bind="{ item, index }" />
    </template>
  </v-virtual-scroll>
</template>

<script>
export default {
  name: "VirtualScroll",
  props: {
    items: Array,
    height: Number,
    itemHeight: Number
  },
  computed: {
    computedHeight() {
      const items = this.items || [];
      return items.length * this.itemHeight <= this.height
          ? items.length * this.itemHeight
          : this.height
    }
  },
}
</script>