<template>
  <v-card :loading="loading" :disabled="loading">
    <slot name="header">
      <v-card-title class="d-flex justify-space-between">
        <span>Copy Invitation</span>
        <v-btn icon @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
    </slot>
    <v-card-text class="pt-4">

      <div v-if="inviteUser">
        <p class="mb-10 primary--text">Copy invitation link for:  <strong>{{ inviteUser.email }}</strong></p>
      </div>

      <v-form ref="form">
          <business-property-select
              label="Property" outlined dense
              :items="properties"
              :rules="[rules.required]"
              v-model="form.property"
          >
          </business-property-select>
      </v-form>

    </v-card-text>
    <slot name="action" v-bind="{ submitting, submit }">
      <v-card-actions class="align-center justify-space-between px-5">
        <v-btn color="error" depressed @click="cancel">Cancel</v-btn>
        <v-btn
            :loading="submitting"
            color="primary" depressed
            @click="copyInvitationLink()"
        >
          Copy Invitation Link
        </v-btn>
      </v-card-actions>
    </slot>
  </v-card>
</template>

<script>
import form from "@/mixins/form";
import select from "@/mixins/select";
import { mapMutations } from "vuex";
import business from "@/domain/Business/Mixins/business";
import BusinessPropertySelect from "@/domain/Business/Components/BusinessPropertySelect.vue";

export default {
  name: "BusinessUserForm",
  mixins:[select, form, business],
  components: {
    BusinessPropertySelect,
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    hostUrl() {
      return window.location.origin;
    }
  },

  props: {
    properties: Array,
    inviteUser: Object,
    property: Object,
    business: Object,
  },

  methods: {
    ...mapMutations(['SNACKBAR']),

    cancel() {
      this.$emit("cancel")
    },

    setForm() {
      this.form = {
        property: null
      }
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
          .then(() => {
            // Success!
            this.$store.commit("SNACKBAR", {
              status: true,
              text: `Invitation link copied to clipboard successfully`,
              color: 'success'
            });
          })
          .catch(err => {
            // Handle errors
            this.$store.commit("SNACKBAR", {
              status: true,
              text: `Failed to copy invitation link`,
              color: 'error'
            });
          });
    },

    copyInvitationLink() {
      const url = this.hostUrl + "/invite/" + this.business.id + "/" + this.form.property;
      this.copyToClipboard(url);
      this.$emit("link-copied");
    }

  },
  watch: {
    properties: {
      immediate: true,
      handler() {
        this.setForm();
      }
    }
  }
}
</script>