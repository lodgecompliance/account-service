<template>
  <user-profile-page>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <id-verification-form
            flat
            :key="version"
            :user="profile"
            :verification="profile.id_verification"
            @update="version++"
            @saved="idVerificationUpdated"
        >
        </id-verification-form>
      </v-col>
    </v-row>
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


