<template>
  <data-container
      :loading="loading"
      :error="error"
      @retry="getWalletAccount"
  >
    <section>
      <div class="d-flex justify-space-between">
        <div>
          <h4>Wallet Account</h4>
          <small class="grey--text" v-if="account">{{account.id}}</small>
        </div>
        <div class="">
          <slot name="cta" v-bind="{ account }" />
          <v-btn v-if="wallets.length > 0" text color="primary" @click="newWalletDialog = true" :disabled="!account">
            <v-icon>mdi-plus</v-icon> Create Wallet
          </v-btn>
          <!--          <v-menu origin="center center" transition="scale-transition" :disabled="!account">-->
          <!--            <template v-slot:activator="{ on }">-->
          <!--              <v-btn icon v-on="on">-->
          <!--                <v-icon>mdi-dots-vertical</v-icon>-->
          <!--              </v-btn>-->
          <!--            </template>-->
          <!--            <v-list dense>-->
          <!--              <v-list-item @click="newWalletDialog = true">-->
          <!--                <v-list-item-content>-->
          <!--                  <v-list-item-title>Create Wallet</v-list-item-title>-->
          <!--                </v-list-item-content>-->
          <!--              </v-list-item>-->
          <!--              <slot name="menu-items" />-->
          <!--            </v-list>-->
          <!--          </v-menu>-->

          <v-dialog
              v-model="newWalletDialog"
              width="400"
              scrollable
              persistent
          >
            <wallet-create-form
              :wallet-account="account"
              :disallowed="wallets.map(w => w.type.currency)"
              v-on="$listeners"
              @wallet-created="walletCreated"
            >
              <template #action="{ submitting, submit }">
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text @click="newWalletDialog = false">
                    Cancel
                  </v-btn>
                  <v-btn
                      :loading="submitting"
                      color="primary" depressed
                      @click="submit()"
                  >
                    Create Wallet
                  </v-btn>
                </v-card-actions>
              </template>
            </wallet-create-form>
          </v-dialog>
        </div>
      </div>
    </section>

    <v-row v-if="wallets.length">
      <v-col cols="12" sm="6" md="4" v-for="wallet in wallets" :key="wallet.id">
        <wallet-card :wallet="wallet" />
      </v-col>
    </v-row>
    <div v-else class="grey--text text-center py-5">
      <v-btn text color="primary" @click="newWalletDialog = true" :disabled="!account">
        <v-icon>mdi-plus</v-icon> Create Wallet
      </v-btn>
    </div>
  </data-container>
</template>

<script>
import wallet from "@/domain/Wallet/Mixins/wallet";
import DataContainer from "@/components/DataContainer.vue";
import WalletCreateForm from "@/domain/Wallet/Components/WalletCreateForm.vue";
import WalletCard from "@/domain/Wallet/Components/WalletCard.vue";

export default {
  name: 'WalletAccount',
  mixins: [wallet],
  components:{ WalletCard, WalletCreateForm, DataContainer },
  data(){
    return {
      loading: false,
      error: null,
      account: null,
      newWalletDialog: false,
    };
  },

  computed: {
    wallets() {
      return this.account?.wallets || []
    }
  },

  props: {
    accountId: String,
    type: String,
    metadata: Array
  },

  methods: {
    createWalletAccount() {
      this.loading = true;
      this.error = null;
      this.createAccount(this.type, this.metadata)
      .then(account => {
        this.account = account;
        this.$emit('wallet-account-created', account)
      })
      .catch(e => this.error = e)
      .finally(() => {
        this.loading = false
      })
    },

    getWalletAccount() {
      if(!this.accountId) {
        return this.createWalletAccount();
      }
      this.loading = true;
      this.error = null;
      this.getAccount(this.accountId)
      .then(account => {
        this.account = account;
      })
      .catch(e => this.error = e)
      .finally(() => {
        this.loading = false
      })
    },

    walletCreated(wallet) {
      this.newWalletDialog = false;
      this.$store.commit('SNACKBAR', {
        color: 'success',
        text: 'Wallet created',
        status: true,
      })
      this.account.wallets.push(wallet)
    }

  },
  watch: {
    accountId: {
      immediate: true,
      handler() {
        this.getWalletAccount()
      }
    }
  }
}
</script>
