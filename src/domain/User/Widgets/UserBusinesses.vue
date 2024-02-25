<template>
  <section>
    <corner-dialog v-model="dialog" width="400" scrollable>
      <business-details-form
        v-if="business"
        :business="business"
        @saved="businessUpdated"
      >
      <template #header>
        <v-card-title>
          <h4 class="text-truncate">{{ business.name }}</h4>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
      </template>
      <template #actions="{ loading, submitting, submit, canSubmit }">
        <v-card-actions class="mt-5">
          <v-btn
              :loading="submitting"
              :disabled="loading || !canSubmit"
              color="primary" depressed block
              @click="submit()"
          >
            Save Changes
          </v-btn>
        </v-card-actions>
      </template>
    </business-details-form>
    </corner-dialog>
    <v-data-table
        :headers="headers"
        :items="businesses"
        :search="search"
        v-bind="$attrs"
        fixed-header
        height="500"
    >
      <template v-slot:item.name="{ item }">
        <div class="d-flex align-center">
          <profile-avatar
              :profile="item"
              color="accent"
          >
            <template #icon="{ size }">
              <v-icon color="primary" :size="size">mdi-briefcase-account</v-icon>
            </template>
          </profile-avatar>
          <div class="ml-2">
            <div>{{ item.name }}</div>
            <small class="grey--text text-truncate">{{ item.address }}</small>
          </div>
        </div>
      </template>

      <template v-slot:item.wallets="{ item }">
        <div v-if="!item.wallet_account.wallets.length">--</div>
        <div v-else class="py-1">
          <v-chip v-for="wallet in item.wallet_account.wallets" :key="wallet.id"
              class="text-capitalize ma-1"
              small outlined label>
            {{ wallet.type.name | nullable }}
          </v-chip>
        </div>
      </template>

      <template v-slot:item.status="{ item }">
        <business-status :business="item" />
      </template>

      <template v-slot:item.action="{ item }">
        <v-btn icon @click="business = item"><v-icon color="primary">mdi-eye</v-icon></v-btn>
      </template>

    </v-data-table>
  </section>
</template>

<script>
import form from "@/mixins/form";
import user from "@/domain/User/Mixins/current_user"
import BusinessStatus from "@/domain/Business/Components/BusinessStatus.vue";
import ProfileAvatar from "@/components/ProfileAvatar.vue";
import BusinessDetailsForm from "@/domain/Business/Components/BusinessDetailsForm.vue";
import {mapMutations} from "vuex";
import CornerDialog from "@/components/CornerDialog.vue";

export default {
  name: 'UserBusinesses',
  mixins: [form, user],
  components:{CornerDialog, BusinessDetailsForm, ProfileAvatar, BusinessStatus },
  data(){
    return {
      dialog: false,
      business: null,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Country', value: 'country', sortable: false},
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Action', value: 'action', sortable: false },
      ]
    };
  },
  props: {
    search: String,
    user: Object,
  },
  methods: {
    ...mapMutations(['SET_USER_BUSINESS_KEYS']),
    businessUpdated(update) {
      this.business = null;
      this.$emit('business-updated', update);
    },
  },
  watch: {
    business: {
      immediate: true,
      handler(business) {
        this.dialog = !!business
      }
    }
  }
}
</script>
