<template>
  <item-status :status="business.status || 'pending'"/>
</template>

<script>
import ItemStatus from "@/components/ItemStatus";
export default {
  name: "BusinessStatus",
  components: {ItemStatus},
  props: {
    business: Object
  },
}
</script>