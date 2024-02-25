<template>
  <item-status :status="user.status" />
</template>

<script>
import ItemStatus from "@/components/ItemStatus";
export default {
  name: "UserStatus",
  components: {ItemStatus},
  props: {
    user: Object
  },
}
</script>