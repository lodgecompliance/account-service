<template>
  <v-form ref="form">
    <v-text-field
        outlined dense
        label="Public key"
        :rules="[rules.required]"
        type="text"
        v-model="form.public_key"
    ></v-text-field>
    <v-text-field
        outlined dense
        label="Secret key"
        :rules="[rules.required]"
        type="text"
        v-model="form.secret_key"
    ></v-text-field>
    <v-btn
        color="primary"
        :loading="saving"
        @click="save"
        depressed
    >
      Save changes
    </v-btn>
  </v-form>
</template>

<script>
import integration_setup from "@/domain/Business/Mixins/integration_setup";

export default {
  name: "PaystackSetup",
  mixins: [integration_setup],
  methods: {
    setForm() {
      this.form = {
        public_key: this.credentials.public_key || null,
        secret_key: this.credentials.secret_key || null
      }
    },
    save() {
      this.$refs.form.validate() && this.$emit('setup', { credentials: this.form })
    },
  },
}
</script>