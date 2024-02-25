<template>
  <v-form ref="form">
    <v-text-field
        outlined dense
        label="Hotel code"
        :rules="[rules.required]"
        type="text"
        v-model="form.hotel_code"
    ></v-text-field>
    <v-text-field
        outlined dense
        label="Auth code"
        :rules="[rules.required]"
        type="text"
        v-model="form.auth_code"
    ></v-text-field>
    <v-btn
        color="primary"
        :loading="saving"
        @click="save"
        depressed
    >Save changes
    </v-btn>
  </v-form>
</template>

<script>
import integration_setup from "@/domain/Business/Mixins/integration_setup";

export default {
  name: "EzeeSetup",
  mixins: [integration_setup],
  methods: {
    setForm() {
      this.form = {
        auth_code: this.credentials.hotel_code || null,
        hotel_code: this.credentials.hotel_code || null
      }
    },
    save() {
      this.$refs.form.validate() && this.$emit('setup', { credentials: this.form });
    },
  },
}
</script>