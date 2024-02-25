<template>

  <v-card outlined>
    <v-card-title>
      <span>{{ type.currency }} Wallet</span>
    </v-card-title>
    <v-card-text>
      <h1>{{ wallet.available }}</h1>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "WalletCard",
  components: {},
  data() {
    return {}
  },
  props: {
    wallet: Object,
  },
  computed: {
    type() {
      return this.wallet?.type || {}
    }
  }
}
</script>