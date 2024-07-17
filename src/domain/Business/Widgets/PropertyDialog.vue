<template>
  <corner-dialog
      v-model="dialog"
      width="400"
      persistent
      scrollable
  >
    <template v-if="hasActivator" v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="$attrs.activator"
          v-on="on"
      >
        <slot>Property</slot>
      </v-btn>
    </template>
    <business-property-form
        :business="business"
        :property="property"
        v-on="$listeners"
        @property-created="dialog = false"
        @close="dialog = false"
    />
  </corner-dialog>
</template>

<script>
import BusinessPropertyForm from "@/domain/Business/Components/BusinessPropertyForm.vue";
import CornerDialog from "@/components/CornerDialog.vue";
export default {
  name: "BusinessPropertyDialog",
  components: {CornerDialog, BusinessPropertyForm },
  data() {
    return {
      dialog: false,
    }
  },

  props: {
    business: Object,
    property: Object,
    hasActivator: {
      type: Boolean,
      default: true,
    }
  },

  watch: {
    property: {
      immediate: true,
      handler() {
        this.dialog = !!this.property;
      }
    }
  }
}
</script>