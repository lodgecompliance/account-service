<template>
  <section class="text-center">
    <p>We sent a one time validation code to {{ phone }}. Enter the 6 digit code below before it expires</p>
    <v-form ref="form" >
      <v-text-field
          outlined dense
          v-model="otp"
          label="Verification code"
          :rules="[rules.required]" >
      </v-text-field>
    </v-form>
    <v-btn block @click="submit" color="primary" class="my-2"  depressed>Verify</v-btn>
    <v-btn block @click="$emit('change-phone')" color="primary" class="my-2" small text>Use another phone number</v-btn>
    <v-btn block @click="$emit('resend', true)" color="primary" class="my-2" small text>Resend verification code</v-btn>
  </section>
</template>
<script>
import form from '@/mixins/form'
export default {
  name: "PhoneOtpInput",
  mixins: [form],
  data() {
    return {
      otp: null
    }
  },
  props: {
    phone: String
  },
  methods: {
    submit() {
      if(!this.$refs.form.validate()) return;
      this.$emit("input", this.otp);
    }
  }
}
</script>

