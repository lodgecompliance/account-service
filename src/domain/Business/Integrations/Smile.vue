<template>
<v-form ref="form">
    <v-text-field
        outlined dense
        label="Partner ID"
        :rules="[rules.required]"
        type="text"
        v-model="form.partner_id"
    ></v-text-field>
    <v-text-field
        outlined dense
        label="API Key"
        :rules="[rules.required]"
        type="text"
        v-model="form.api_key"
    ></v-text-field>
    <v-text-field
        outlined dense
        label="SID Server"
        :rules="[rules.required]"
        type="text"
        v-model="form.sid_server"
    ></v-text-field>
    <v-btn
        color="primary"
        :loading="saving"
        @click="save"
        depressed>
      Save changes
    </v-btn>
</v-form>
</template>

<script>
import integration_setup from "@/domain/Business/Mixins/integration_setup";

export default {
    name: "SmileSetup",
    mixins: [integration_setup],
    methods: {
      setForm() {
        this.form = {
          partner_id: this.credentials.partner_id,
          api_key: this.credentials.api_key,
          sid_server: this.credentials.sid_server,
        }
      },
      save() {
        this.$refs.form.validate() && this.$emit('setup', { credentials: this.form })
      },
    },
}
</script>