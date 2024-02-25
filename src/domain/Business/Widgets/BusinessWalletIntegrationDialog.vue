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
        <slot>Wallet</slot>
      </v-btn>
    </template>
    <wallet-account-integration-form
    :business="business"
    :wallet-account="walletAccount"
    v-on="$listeners"
    @wallet-account-updated="dialog = false"
    @cancel="dialog = false"
    />
  </corner-dialog>
</template>

<script>
import CornerDialog from "@/components/CornerDialog.vue";
import WalletAccountIntegrationForm
  from "@/domain/Wallet/Components/WalletAccountIntegrationForm.vue";
export default {
  name: "BusinessWalletIntegrationDialog",
  components: { WalletAccountIntegrationForm, CornerDialog },
  data() {
    return {
      dialog: false,
    }
  },

  props: {
    business: Object,
    walletAccount: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },
}
</script>