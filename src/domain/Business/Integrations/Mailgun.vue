<template>
  <v-form ref="form">
      <v-text-field
          outlined dense
          label="API key"
          :rules="[rules.required]"
          type="text"
          v-model="form.api_key"
      ></v-text-field>
      <v-text-field
          outlined dense
          label="Domain"
          :rules="[rules.required]"
          type="text"
          v-model="form.domain"
      ></v-text-field>
      <v-text-field
          outlined dense
          label="From Address"
          :rules="[rules.required]"
          type="text"
          v-model="form.from_address"
      ></v-text-field>
      <v-btn
          color="primary"
          :loading="saving"
          @click="save"
          depressed
      >Save changes</v-btn>
  </v-form>
</template>

<script>
import integration_setup from "@/domain/Business/Mixins/integration_setup";
export default {
    name: "MailgunSetup",
    mixins: [integration_setup],
    methods: {
      setForm() {
        this.form = {
          api_key: this.credentials.api_key,
          domain: this.credentials.domain,
          from_address: this.credentials.from_address
        }
      },
      save() {
        this.$refs.form.validate() && this.$emit('setup', { credentials: this.form });
      },
    },
}
</script>