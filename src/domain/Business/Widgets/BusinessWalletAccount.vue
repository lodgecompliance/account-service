<template>
  <wallet-account
  :account-id="business.wallet_account_id"
  type="business"
  :metadata="[{ key: 'business', value: business.id }]"
  v-on="$listeners"
  >
    <template #cta="{ account }">
      <business-wallet-integration-dialog
        :business="business"
        :wallet-account="account"
        :activator="{ color: 'primary', depressed: true, disabled: !account  }"
      >
        Set Integrations
      </business-wallet-integration-dialog>
    </template>
  </wallet-account>
</template>

<script>
import BusinessWalletIntegrationDialog from "@/domain/Business/Widgets/BusinessWalletIntegrationDialog.vue";
import WalletAccount from "@/domain/Wallet/Widgets/WalletAccount.vue";
export default {
  name: 'BusinessWalletAccount',
  components:{WalletAccount, BusinessWalletIntegrationDialog },
  data(){
    return {};
  },
  props: {
    business: Object,
  },
  methods: {

  }
}
</script>
