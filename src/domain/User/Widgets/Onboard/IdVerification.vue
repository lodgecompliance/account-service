<template>
    <id-verification-form
        :user="$store.getters.current_user.profile"
        :verification="verification" flat
        @saved="idVerificationSaved">
      <template #actions>
        <slot name="actions" v-bind="{ verification, verified }" />
      </template>
    </id-verification-form>
</template>

<script>
import { mapGetters } from "vuex";
import IdVerificationForm from "@/domain/User/Components/IdVerificationForm";
import current_user from "@/domain/User/Mixins/current_user";
export default {
  name: 'IdVerification',
  mixins: [current_user],
  components:{ IdVerificationForm },
  data(){
      return {};
  },

  computed: {
    ...mapGetters(['current_user']),
    verification() {
      return this.current_user.profile?.id_verification
    },
    verified() {
      return this.verification?.[this.verification.provider]?.verified
    }
  },

  methods: {
    idVerificationSaved(verification) {
      this.idVerificationUpdated(verification)
      if(this.verified) {
        this.$emit('completed', verification)
      }
    }
  }
}
</script>
