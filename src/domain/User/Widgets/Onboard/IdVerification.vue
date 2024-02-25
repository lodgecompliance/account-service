<template>
    <id-verification-form
        :user="$store.getters.current_user.profile"
        :verification="verification" flat
        @saved="idVerificationSaved">
      <template #actions="{ loading, submitting, submit }">
        <slot name="actions" v-bind="{ loading, submitting, submit }"></slot>
      </template>
    </id-verification-form>
</template>

<script>
    import IdVerificationForm from "@/domain/User/Components/IdVerificationForm";
    export default {
        name: 'IdVerification',
        components:{ IdVerificationForm },
        data(){
            return {};
        },

        computed: {
            verification() {
              return this.$store.getters.current_user.profile?.id_verification
            }
        },

        methods: {
          idVerificationSaved(id_verification) {
            this.$store.commit('SET_USER_PROFILE_KEYS', { id_verification })
            this.$emit('completed', id_verification)
          }
        }
    }
</script>
<style>

</style>
