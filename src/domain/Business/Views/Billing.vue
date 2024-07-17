<template>
  <business-profile-page>
    <business-credit-cards
        :business="currentBusiness"
        @credit-card-added="$store.dispatch('getBusinessOnboardingItems')"
    />
  </business-profile-page>
</template>

<script>
import current_business from "@/domain/Business/Mixins/current_business";
import BusinessProfilePage from "@/domain/Business/Views/Profile.vue";
import business from "@/domain/Business/Mixins/business";
import BusinessWalletAccount from "@/domain/Business/Widgets/BusinessWalletAccount.vue";
import { mapMutations } from "vuex";
import BusinessCreditCards from "@/domain/Business/Widgets/BusinessCreditCards.vue";

export default {
  name: "BusinessBillingPage",
  mixins:[current_business],
  components: {
    BusinessCreditCards,
    BusinessProfilePage,
  },
  data() {
    return {}
  },
  methods: {}
}

</script>


