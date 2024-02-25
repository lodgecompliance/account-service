<template>
  <data-container
      :loading="loading"
      :error="error"
      @retry="getCards"
  >
    <confirmation-dialog ref="confirmation" @confirmed="confirmation.action()">
      {{ confirmation.text }}
    </confirmation-dialog>
    <div class="d-flex justify-end">
      <business-credit-card-dialog
          :business="business"
          :activator="{ color: 'primary', depressed: true }"
          @credit-card-added="c => cards.unshift(c)"
      >
        <v-icon>mdi-plus</v-icon> Add card
      </business-credit-card-dialog>
    </div>
    <div v-if="!cards.length" class="text-center grey--text py-5">
      There is no card yet
    </div>
    <v-row v-else>
      <v-col
          v-for="card in cards"
          :key="card.id"
          cols="12" sm="6" md="4"
      >
        <stripe-credit-card :card="card">
          <template #actions="attr">
            <v-spacer></v-spacer>
            <v-btn icon @click="confirmCardRemoval(attr.card)">
              <v-icon small color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </stripe-credit-card>
      </v-col>
    </v-row>
  </data-container>
</template>

<script>
import credit_card from "@/domain/Business/Mixins/credit_card";
import DataContainer from "@/components/DataContainer.vue";
import StripeCreditCard from "@/components/StripeCreditCard.vue";
import BusinessCreditCardDialog from "@/domain/Business/Widgets/BusinessCreditCardDialog.vue";
import ConfirmationDialog from "@/components/Utilities/ConfirmationDialog.vue";
export default {
  name: 'BusinessCreditCards',
  mixins: [credit_card],
  components:{ConfirmationDialog, BusinessCreditCardDialog, StripeCreditCard, DataContainer},
  data(){
    return {
      loading: false,
      error: null,
      confirmation: {
        text: String,
        action: Function
      },
      customer: null,
      cards: [],
    };
  },
  props: {
    business: Object,
  },
  methods: {
    getCards() {
      this.loading = true;
      this.error = null;
      this.getBusinessCreditCards(this.business.id).then(response => {
        this.customer = response?.customer;
        this.cards = response?.sources?.data || []
      })
      .catch(e => this.error = e)
      .finally(() => this.loading = false)
    },

    removeCreditCard(card){
      this.removeBusinessCreditCard(this.business.id, card.id)
      .then(removed => {
        if(removed) {
          this.cards.splice(this.cards.findIndex(c => c.id === card.id), 1);
          this.$store.commit("SNACKBAR", {
            status: true,
            text: `Credit card removed`,
            color: "success"
          })
        }
        else return Promise.reject(new Error())
      })
      .catch(e => {
        this.$store.commit("SNACKBAR", {
          status: true,
          text: `Credit card not removed. ${e.message}`,
          color: "error"
        })
      })
    },

    confirmCardRemoval(card){
      this.confirmation = {
        text: `Are you sure you want to remove the card ending ${card.last4} `,
        action: () => {
          this.removeCreditCard(card)
        }
      }
      this.$refs.confirmation.open();
    },

  },
  watch: {
    business: {
      immediate: true,
      handler() {
        this.getCards()
      }
    }
  }
}
</script>
