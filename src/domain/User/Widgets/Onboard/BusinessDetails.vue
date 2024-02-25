<template>
  <business-details-form :business="currentBusiness" @saved="businessSaved" flat>
    <template #actions="{ loading, submitting, submit }">
      <slot name="actions" v-bind="{ loading, submitting, submit }"></slot>
    </template>
  </business-details-form>
</template>

<script>
import BusinessDetailsForm from "@/domain/Business/Components/BusinessDetailsForm";
import current_user from "@/domain/User/Mixins/current_user";
import current_business from "@/domain/Business/Mixins/current_business";
export default {
    name: 'BusinessDetails',
    mixins: [current_user, current_business],
    components:{BusinessDetailsForm},
    data(){
        return {};
    },

    methods: {
      businessSaved(business) {
        if(this.currentBusiness) this.businessUpdated(business)
        else this.newBusinessCreated(business)
        this.$emit("completed", this.currentBusiness);
      }
    }
}
</script>

