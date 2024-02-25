<template>
  <v-card>
    <slot name="title">
      <v-card-title>
        Create Wallet
      </v-card-title>
    </slot>
    <slot name="subtitle"></slot>
    <v-card-text class="pt-5">
      <v-form ref="form">
        <error-handler :error="formError" />
        <v-autocomplete
            v-model="form.wallet_type"
            :items="walletTypes"
            item-value="value"
            item-text="label"
            dense
            outlined
            label="Wallet Type"
            placeholder="Select a wallet type"
            :rules="[rules.required]"
        >
          <template #item="{ item: type, on }">
            <v-list-item
                dense
                v-on="on"
                :disabled="disallowed.map(c => c.toLowerCase()).includes(type.value)"
            >
              <v-list-item-content>
                <v-list-item-title>{{ type.label }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-autocomplete>
      </v-form>
    </v-card-text>
    <slot name="action" v-bind="{ submitting, submit }">
      <v-card-actions>
        <v-btn
            :loading="submitting"
            color="primary" depressed block
            @click="submit()"
        >
          Create Wallet
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import ErrorHandler from "@/components/ErrorHandler.vue";
import wallet from "@/domain/Wallet/Mixins/wallet";

export default {
  name: "WalletCreateForm",
  mixins:[form, wallet],
  components: {ErrorHandler },
  data() {
    return {
      dialog: false,
      walletTypes: [
        { label: "US Dollar" , value: "usd" },
        { label: "NGN Naira" , value: "ngn" },
        { label: "British Pound" , value: "gbp" },
      ]
    }
  },

  props: {
    walletAccount: Object,
    disallowed: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        this.createAccountWallet(this.walletAccount.id, this.form.wallet_type)
        .then(wallet => {
          this.$emit("wallet-created", wallet);
          this.$refs.form.reset();
          return resolve(wallet)
        }).catch(e => reject(e))
      })
    }
  }
}
</script>