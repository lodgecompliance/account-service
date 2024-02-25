<template>
  <v-card :loading="loading" :disabled="loading">

    <v-card-title class="d-flex justify-space-between">
      <span>Wallet Integrations</span>
      <v-btn icon @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="pt-5">
      <v-form ref="form">
        <business-integration-select
            outlined dense
            v-for="integration in ['stripe', 'paystack', 'revolut']"
            :key="integration"
            :label="`Select ${integration} integration`"
            :items="integrations"
            item-value="ref"
            :exclude="integrations.filter(i => i.type.identifier !== integration).map(i => i.id)"
            v-model="form.integrations[integration]"
        >
          <template v-if="form.integrations[integration]" #append>
            <v-btn @click="form.integrations[integration] = null" color="red" small text>Unset</v-btn>
          </template>
        </business-integration-select>
      </v-form>
    </v-card-text>

    <slot name="action" v-bind="{ submitting, submit }">
      <v-card-actions class="align-center px-5">
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
        <v-btn
            :loading="submitting"
            color="primary" depressed
            @click="submit()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import { mapMutations } from "vuex";
import BusinessIntegrationSelect from "@/domain/Business/Components/BusinessIntegrationSelect.vue";
import business from "@/domain/Business/Mixins/business";
import wallet from "@/domain/Wallet/Mixins/wallet";

export default {
  name: "WalletAccountIntegrationForm",
  mixins:[form, business, wallet],
  components: {
    BusinessIntegrationSelect,
  },
  data() {
    return {
      loading: false,
      integrations: []
    }
  },

  props: {
    business: Object,
    walletAccount: Object
  },

  methods: {
    ...mapMutations(['SNACKBAR']),
    cancel() {
      this.$emit("cancel")
    },

    setForm() {
      const walletAccount = this.walletAccount || {}
      this.form = {
        integrations: walletAccount.integrations || {}
      }
    },

    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        this.setAccountIntegration(this.walletAccount.id, this.form.integrations)
        .then(account => {
          this.SNACKBAR({
            status: true,
            text: "Integrations updated!",
            color: 'success'
          })
          this.$emit('wallet-account-updated', account);
          resolve(account);
        })
        .catch(e => reject(e))
      })
    },

  },

  watch: {
    business: {
      immediate: true,
      handler() {
        this.getBusinessById(this.business.id, `
            integrations {
                id
                enabled
                title
                ref
                type {
                    name
                    tags
                    identifier
                    description
                }
              }
          `)
            .then(business => {
              this.integrations = (business?.integrations || [])
            }).finally(() => this.loading = false)
      }
    },

    walletAccount: {
      immediate: true,
      handler() {
        this.setForm();
      }
    }
  }
}
</script>