<template>
  <business-profile-page>
    <business-wallet-account
        :business="currentBusiness"
        @wallet-account-created="accountCreated"
    />
  </business-profile-page>

</template>

<script>
import current_business from "@/domain/Business/Mixins/current_business";
import BusinessProfilePage from "@/domain/Business/Views/Profile.vue";
import business from "@/domain/Business/Mixins/business";
import BusinessWalletAccount from "@/domain/Business/Widgets/BusinessWalletAccount.vue";
import { mapMutations } from "vuex";

export default {
  name: "BusinessWalletsPage",
  mixins:[current_business, business],
  components: {
    BusinessWalletAccount,
    BusinessProfilePage,
  },
  data() {
    return {
      loading: false,
      error: null,
      account: null,
    }
  },
  methods: {
    ...mapMutations([
        'SET_USER_BUSINESS_KEYS'
    ]),
    accountCreated(account) {
      this.saveBusinessAttribute(
          this.currentBusiness.id,
          [
              { key: 'wallet_account_id', value: account.id }
          ]
      ).then(() => {
        this.SET_USER_BUSINESS_KEYS({ wallet_account_id: account.id })
      })
    },
  }
}

</script>


