<template>
  <v-card v-bind="$attrs" v-if="card" outlined>
    <v-card-title>
      <h4>{{ card.card_number }}</h4>
    </v-card-title>
    <v-card-text class="d-flex">
      Expiry: {{ card.expiry_date }}
      <v-spacer></v-spacer>
      cvv: {{ card.cvv }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
    name: "WithdrawalCreditCard",
    props: {
        card: Object
    }
}
</script>