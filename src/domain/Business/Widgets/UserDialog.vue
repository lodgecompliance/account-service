<template>
  <corner-dialog
      v-model="dialog"
      width="400"
      persistent
      scrollable
  >
    <template v-if="hasActivator" v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="$attrs.activator"
          v-on="on"
      >
        <slot>User</slot>
      </v-btn>
    </template>
    <business-user-form
        :business="business"
        :business-user="businessUser"
        v-on="$listeners"
        @user-created="dialog = false"
        @cancel="dialog = false"
    />
  </corner-dialog>
</template>

<script>
import CornerDialog from "@/components/CornerDialog.vue";
import BusinessUserForm from "@/domain/Business/Components/BusinessUserForm.vue";
export default {
  name: "BusinessUserDialog",
  components: { BusinessUserForm, CornerDialog },
  data() {
    return {
      dialog: false,
    }
  },

  props: {
    business: Object,
    businessUser: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },

  watch: {
    businessUser: {
      immediate: true,
      handler() {
        this.dialog = !!this.businessUser;
      }
    }
  }

}
</script>