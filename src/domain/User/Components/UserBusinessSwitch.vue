<template>
  <business-select
  :items="businesses"
  :value="currentBusiness ? currentBusiness.id : null"
  @input="switchUserBusiness"
  outlined dense
  :select-first-as-default="true"
  placeholder="Select a business"
  no-data-text="You don't have or belong to any business"
  return-object
  style="max-width: 350px"
  />
</template>
<script>
import current_user from "@/domain/User/Mixins/current_user";
import BusinessSelect from "@/domain/Business/Components/BusinessSelect";
import current_business from "@/domain/Business/Mixins/current_business";
export default {
  name: "UserBusinessSwitch",
  mixins: [current_user, current_business],
  components: {BusinessSelect}
}
</script>