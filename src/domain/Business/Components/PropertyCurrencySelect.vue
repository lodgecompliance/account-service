<template>
    <v-autocomplete 
        :loading="loading"
        :items="items"
        v-on="$listeners"
        v-bind="$attrs"
        :no-data-text="`${loading ? 'Please wait...': `No currency.`}`"
    >
    </v-autocomplete>
</template>

<script>
import property from "@/domain/Business/Mixins/property";
export default {
    name: "PropertyCurrencySelect",
    mixins: [property],
    data(){
        return {
            loading: false,
            items: [],
        }
    },
    methods: {
      getCurrencies(){
        this.loading = true;
        this.getPropertyCurrencies()
          .then(currencies => {
            this.items = currencies;
          })
          .finally(() => {
              this.loading = false;
          })
      }
    },
    mounted() {
        this.getCurrencies();
    }
}
</script>