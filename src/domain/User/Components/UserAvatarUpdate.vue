<template>
  <avatar-form
      :size="80"
      :profile="user"
      :loading="submitting"
      color="accent"
      @change="updateAvatar"
  />
</template>

<script>
import form from "@/mixins/form";
import AvatarForm from "@/components/AvatarForm";
import gql from "graphql-tag";
import user from "@/domain/User/Mixins/user";

export default {
  name: 'UserAvatarUpdate',
  components:{ AvatarForm },
  mixins: [form, user],
  props: {
    user: Object
  },
  methods: {
    submission() {
      const image = this.form.image;
      return new Promise((resolve, reject) => {
        this.saveUserAttribute( this.user.id, [ { key: "image", value: image } ])
            .then(response => {
              this.$emit("updated", image);
              resolve(response);
        }).catch(e => reject(e))
      })
    },

    updateAvatar(image) {
      this.form.image = image;
      this.submit();
    }
  }
}
</script>
