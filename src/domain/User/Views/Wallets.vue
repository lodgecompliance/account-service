<template>
  <user-profile-page>
    <wallet-account
      type="individual"
      :account-id="profile.wallet_account_id"
      :metadata="[{ key: 'user', value: profile.id }]"
      @wallet-account-created="accountCreated"
    />
  </user-profile-page>
</template>

<script>
import current_user from "@/domain/User/Mixins/current_user";
import UserProfilePage from "@/domain/User/Views/Profile.vue";
import WalletAccount from "@/domain/Wallet/Widgets/WalletAccount.vue";
import user from "@/domain/User/Mixins/user"
import { mapMutations } from "vuex";
export default {
  name: "UserWalletsPage",
  mixins:[current_user, user],
  components: { WalletAccount, UserProfilePage },
  data() {
    return {
      version: 0
    }
  },
  methods: {

    ...mapMutations([
        'SET_USER_PROFILE_KEYS'
    ]),

    accountCreated(account) {
      this.saveUserAttribute(
          this.profile.id,
          [
            { key: 'wallet_account_id', value: account.id }
          ]
      ).then(() => {
        this.SET_USER_PROFILE_KEYS({ wallet_account_id: account.id })
      })
    },
  }
}
</script>


