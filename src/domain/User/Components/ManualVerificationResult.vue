<template>
  <v-card v-if="verification" v-bind="$attrs">
    <v-card-text class="p-0">
      <slot v-bind="{ verification }">
        <v-row>
          <v-col cols="12" md="6">
            <files-preview
                :value="[verification.id_image]"
                :grid="1"
                :allow-remove="false"
                :item-height="400"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-card-title>
              {{ [verification.first_name, verification.last_name].join(" ") }}
            </v-card-title>
            <v-card-subtitle class="grey--text">
              {{ verification.id_type }}: {{ verification.id_number }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </slot>
    </v-card-text>
  </v-card>
</template>
<script>
import FilesPreview from "@/components/FilesPreview.vue";

export default {
  name: "ManualVerificationResult",
  components: { FilesPreview },
  data() {
    return {}
  },
  props: {
    verification: Object,
  },
}
</script>