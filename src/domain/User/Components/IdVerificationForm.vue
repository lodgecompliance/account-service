<template>
    <v-card v-bind="$attrs" >
      <slot name="header" />
      <v-card-text>
        <identity-verification-setting
            :user="user"
            :verification="verification || {}"
            @synced="(id) => $emit('saved', id)"
        />
      </v-card-text>
      <slot name="actions" />
    </v-card>
</template>

<script>
import form from "@/mixins/form";
import user from "@/domain/User/Mixins/user";
import IdentityVerificationSetting from "@/domain/User/Widgets/IdentityVerificationSetting.vue";

export default {
  name: "IdVerificationForm",
  mixins: [form, user],
  components: {
    IdentityVerificationSetting,
  },
  data() {
    return {}
  },
  props: {
    user: Object,
    verification: Object,
  },
}
</script>