<template>
  <user-profile-page>
    <id-verification-form
        flat
        :key="version"
        :user="profile"
        :verification="profile.id_verification"
        @update="version++"
        @saved="idVerificationUpdated"
    >
      <template #actions="{ loading, submitting, submit, canSubmit }">
        <v-card-actions>
          <v-btn
              :loading="submitting"
              :disabled="loading || !canSubmit"
              color="primary" depressed
              @click="submit()" block>
            Save Changes
          </v-btn>
        </v-card-actions>
      </template>
    </id-verification-form>
  </user-profile-page>
</template>

<script>
import current_user from "@/domain/User/Mixins/current_user";
import IdVerificationForm from "@/domain/User/Components/IdVerificationForm.vue";
import UserProfilePage from "@/domain/User/Views/Profile.vue";
export default {
  name: "IdVerificationPage",
  mixins:[current_user],
  components: { UserProfilePage, IdVerificationForm },
  data() {
    return {
      version: 0
    }
  }
}
</script>


