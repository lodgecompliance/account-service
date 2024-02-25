<template>
  <v-dialog
      v-model="dialog"
      width="400"
      scrollable
      persistent
  >
    <template v-if="hasActivator" v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="$attrs.activator"
          v-on="on"
      >
        <slot>Create Wallet</slot>
      </v-btn>
    </template>
    <wallet-create-form
        :wallet-account="walletAccount"
        :disallowed="wallets.map(w => w.type.currency)"
        v-on="$listeners"
        @wallet-created="dialog = false"
    >
      <template #action="{ submitting, submit }">
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
              :loading="submitting"
              color="primary" depressed
              @click="submit()"
          >
            Create Wallet
          </v-btn>
        </v-card-actions>
      </template>
    </wallet-create-form>
  </v-dialog>
</template>
<script>
import form from "@/mixins/form";
import wallet from "@/domain/Wallet/Mixins/wallet";
import WalletCreateForm from "@/domain/Wallet/Components/WalletCreateForm.vue";

export default {
  name: "WalletCreateDialog",
  components: { WalletCreateForm },
  mixins: [form, wallet],

  data() {
    return {
      dialog: false
    }
  },

  props: {
    walletAccount: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },

  computed: {
    wallets() {
      return this.walletAccount?.wallets || []
    }
  }
}
</script>