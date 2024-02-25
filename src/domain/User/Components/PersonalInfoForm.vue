<template>
  <v-card v-bind="$attrs" :loading="loading">
      <slot name="header" />
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="6">
              <v-text-field
                  v-model="form.first_name"
                  dense
                  outlined
                  label="First name"
                  :rules="[rules.required]"
                  hide-details="auto"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  v-model="form.last_name"
                  dense
                  outlined
                  label="Last name"
                  :rules="[rules.required]"
                  hide-details="auto"></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                  dense
                  outlined
                  v-model="form.email"
                  label="Email"
                  :rules="emailProvider || googleProvider ? [rules.required] : []"
                  hide-details="auto">
                <template #append>
                  <google-connect-badge
                      class="mt-n1" :size="30"
                      :provider="googleProvider"
                      @connect="verifyGoogleConnect"
                      @disconnect="verifyGoogleDisconnect" />
                </template>
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <phone-number
                  :value="form.phone"
                  @input="v => form.phone = v || null"
                  dense
                  outlined
                  :include-meta="false"
                  :disabled="phoneVerificationSent"
                  :rules="phoneProvider ? [rules.required] : []"
              >
                <template #append>
                  <phone-connect-badge
                      :provider="phoneProvider && phoneProvider.phoneNumber === trimedPhone ? phoneProvider : null"
                      :size="30"
                      class="ml-n2" />
                </template>
              </phone-number>
            </v-col>
          </v-row>
        </v-form>
        <error-handler :error="formError" />
        <v-alert
            v-if="alert"
            :type="alert.type" prominent
            :dismissible="true">{{ alert.text }}
        </v-alert>
      </v-card-text>
      <slot name="actions" v-bind="{ loading, submitting, canSubmit, submit }" />
      <div id="recaptcha-container"></div>
      <confirmation-dialog
          ref="confirmation"
          @confirmed="confirmation.onConfirm ? confirmation.onConfirm() : () => {}">
        <div class="text-center">{{ confirmation.text }}</div>
        <template #title>{{ confirmation.title }}</template>
        <template #confirm="{ confirm }">
          <v-btn depressed color="success darken-1" @click="confirm">
            {{ confirmation.btnText || "Confirm" }}
          </v-btn>
        </template>
      </confirmation-dialog>
      <v-dialog
      v-model="phoneVerificationSent"
      persistent
      width="300"
      >
        <v-card>
          <v-card-text class="py-5">
            <phone-otp
                :phone="form.phone"
                @change-phone="changePhoneVerificationNumber"
                @resend="resendPhoneVerification"
                @input="submitPhoneVerificationOtp" />
          </v-card-text>
        </v-card>
      </v-dialog>
  </v-card>
</template>

<script>
import profile from "@/domain/User/Mixins/profile";
import PhoneNumber from "@/components/Utilities/PhoneNumber";
import ErrorHandler from "@/components/ErrorHandler";
import ConfirmationDialog from "@/components/Utilities/ConfirmationDialog";
import PhoneOtp from "@/domain/Auth/Components/PhoneOtpInput";
import GoogleConnectBadge from "@/domain/Auth/Components/GoogleConnectBadge";
import PhoneConnectBadge from "@/domain/Auth/Components/PhoneConnectBadge";

export default {
  name: 'PersonalInfoForm',
  components:{GoogleConnectBadge, PhoneOtp, ConfirmationDialog, PhoneConnectBadge, ErrorHandler, PhoneNumber },
  mixins: [profile],
  data(){
    return {
      confirmation: {
        title: null,
        btnText: null,
        text: null,
        onConfirm: () => {}
      }
    };
  },

  props: {
    pendingUser: Object
  },

  methods: {

    setForm(){
      if(this.current_user.profile){
        this.form = {
          phone: this.current_user.profile.phone,
          email: this.current_user.profile.email,
          first_name: this.current_user.profile.first_name,
          last_name: this.current_user.profile.last_name,
          image: this.profileAvatar || this.googleAvatar
        }
      }  else if (this.pendingUser) {
        this.form.first_name = this.pendingUser.first_name
        this.form.last_name = this.pendingUser.last_name
        this.form.email = this.pendingUser.email
        this.form.phone = this.current_user.auth.phoneNumber
        this.form.image = this.googleAvatar
        this.form.pending_user_id = this.pendingUser.id
      } else {
        this.form.email = this.auth?.email;
        this.form.phone = this.auth?.phoneNumber;
        if(this.auth?.displayName) {
          const names = this.auth.displayName.split(' ');
          this.form.first_name = names[0] || '';
          this.form.last_name = names[1] || '';
        }
        this.form.image = this.googleAvatar;
      }
    },

    submission() {
      if(!this.$refs.form.validate()) return Promise.resolve();
      if(!this.verifyEmail()) return Promise.resolve()
      if(!this.verifyPhone()) return Promise.resolve()
      return new Promise((resolve, reject) => {
        this.saveProfile().then(user => {
          this.$emit("saved", user);
          resolve(user)
        }).catch(e => reject(e))
      })
    },

    verifyEmail() {
      if(
            (this.googleProvider && this.googleProvider.email !== this.form.email)
          || (this.emailProvider && this.emailProvider.email !== this.form.email)
          || (!(this.googleProvider || this.emailProvider) && this.form.email)
      ) {
        this.confirmation.title = "Verification Required"
        this.confirmation.btnText = "Verify Email";
        this.confirmation.text = !this.emailProvider || !this.googleProvider
            ? "This email is not verified yet, it needs to be verified"
            : "Your email has changed, the new one needs to be verified";
        this.confirmation.onConfirm = this.emailConnect
        this.$refs.confirmation.open();
        return false
      }
      return true;
    },

    verifyPhone() {
      if(
          (this.phoneProvider && this.phoneProvider.phoneNumber !== this.trimedPhone)
          || (!this.phoneProvider && this.trimedPhone)
      ) {
        this.confirmation.title = "Verification Required"
        this.confirmation.btnText = "Verify Phone";
        this.confirmation.text = !this.phoneProvider
            ? "This phone number is not verified yet, it needs to be verified"
            : "You changed your phone number, the new one needs to be verified";
        this.confirmation.onConfirm = this.phoneConnect;

        this.$refs.confirmation.open();
        return false
      }
      return true;
    },

    verifyGoogleConnect() {
      this.googleConnect().then(google => {
        this.$emit("update");
        this.$store.commit("SNACKBAR", {
          status: true,
          text: "Google account connected successfully as "+google.displayName,
          color: "success"
        })
      })
    },

    verifyGoogleDisconnect() {
        if(!this.emailProvider) {
          this.confirmation = {
            title: "Email Verification Required",
            text: "You need to verify your email before disconnecting Google account",
            btnText: "Verify",
            onConfirm: this.emailConnect
          }
          this.$refs.confirmation.open();
          return;
        }
        this.confirmation = {
          title: "Disconnect Google",
          text: "Are you sure you want to disconnect the Google account",
          btnText: "Disconnect",
          onConfirm: () => {
            this.providerDisconnect(this.googleProvider.providerId)
              .then(() => {
                this.$emit("update");
                this.$store.commit("SNACKBAR", {
                  status: true,
                  text: "Google account disconnected",
                  color: "success"
                })
              })
          }
      }
        this.$refs.confirmation.open();
    }
  }
}
</script>
