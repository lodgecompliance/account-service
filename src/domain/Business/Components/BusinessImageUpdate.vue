<template>
  <avatar-form
      :size="80"
      :profile="business"
      :loading="submitting"
      color="accent"
      @change="updateImage"
  />
</template>

<script>
import form from "@/mixins/form";
import AvatarForm from "@/components/AvatarForm";
import business from "@/domain/Business/Mixins/business";

export default {
  name: 'BusinessImageForm',
  components:{ AvatarForm },
  mixins: [form, business],
  props: {
    business: Object
  },
  methods: {
    submission() {
      const image = this.form.image;
      return new Promise((resolve, reject) => {
        this.saveBusinessAttribute( this.business.id, [ { key: "image", value: image } ])
            .then(response => {
              this.$emit("updated", image);
              resolve(response);
        }).catch(e => reject(e))
      })
    },

    updateImage(image) {
      this.form.image = image;
      this.submit();
    }
  }
}
</script>
