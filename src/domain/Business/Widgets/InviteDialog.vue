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
    <business-invite-form
        :properties="properties"
        :business="business"
        :invite-user="inviteUser"
        v-on="$listeners"
        @link-copied="dialog = false"
        @cancel="dialog = false"
    />
  </corner-dialog>
</template>

<script>
import CornerDialog from "@/components/CornerDialog.vue";
import BusinessInviteForm from "@/domain/Business/Components/BusinessInviteForm.vue";
export default {
  name: "BusinessInviteDialog",
  components: { BusinessInviteForm, CornerDialog },
  data() {
    return {
      properties: [],
      dialog: false,
    }
  },

  props: {
    inviteUser: Object,
    business: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },

  watch: {
    inviteUser: {
      immediate: true,
      handler() {
        this.dialog = !!this.inviteUser;
        if (this.inviteUser) {
          this.properties = this.inviteUser.properties;
        }
      }
    }
  }

}
</script>