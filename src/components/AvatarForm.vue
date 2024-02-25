<template>
  <file-upload
      v-model="form.image"
      accept="image/*"
      :custom-preview="true"
      @input="imageUploaded"
  >
    <template #default="{ document, selectNewFile }">
      <div v-if="document.uploading || $attrs.loading"
           class="text-center" >
        <v-progress-circular
            indeterminate
            color="primary"
            :size="sizeRatio.progressCircular"
        ></v-progress-circular>
      </div>
      <v-badge
          v-else
          bordered
          bottom
          color="primary"
          :offset-x="sizeRatio.editBadgeOffset"
          :offset-y="sizeRatio.editBadgeOffset"
          icon="mdi-pencil"
          class="white--text"
      >
        <profile-avatar
            :size="size"
            :profile="{ ...profile, image: form.image }"
            v-bind="$attrs"
            @click="selectNewFile"
            style="cursor: pointer"
        />
      </v-badge>
    </template>
  </file-upload>
</template>

<script>
import FileUpload from "@/components/FileUpload";
import ProfileAvatar from "@/components/ProfileAvatar";
import form from "@/mixins/form";

export default {
  name: "AvatarForm",
  mixins: [form],
  components: {
    ProfileAvatar,
    FileUpload,
  },
  data() {
    return {}
  },
  props: {
    size: {
      default: () => 40
    },
    profile: Object
  },

  computed: {
    sizeRatio() {
      return {
        progressCircular: Math.ceil(this.size)/2,
        editBadgeOffset: Math.ceil(this.size)/4
      }
    }
  },

  methods: {
    setForm() {
      this.form = {
        image: this.profile.image
      }
    },
    imageUploaded(image) {
      this.form.image = image;
      this.$emit('change', image)
    }
  }
}
</script>