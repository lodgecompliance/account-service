<template>
 <div>
     <business-property-select
         label="Property" outlined dense
         :items="properties"
         :exclude="excludedProperties"
         :rules="[rules.required]"
         v-model="form.id"
         @input="emitForm"
     >
       <template #append>
         <v-btn @click="$emit('unassign')" color="red" small text>{{ form.id ? 'Unasign' : 'Cancel' }}</v-btn>
       </template>
     </business-property-select>
   <template v-if="form.id">
     <div class="d-flex justify-space-between align-center">
       <v-switch
           v-model="form.enabled"
           inset dense
           label="Enable"
           @change="emitForm"
       >
       </v-switch>
     </div>

     <property-permissions-select
         v-model="form.permissions"
         @input="emitForm"
     />
   </template>
 </div>
</template>

<script>
import form from "@/mixins/form";
import business from "@/domain/Business/Mixins/business";
import BusinessPropertySelect from "@/domain/Business/Components/BusinessPropertySelect.vue";
import PropertyPermissionsSelect from "@/domain/Business/Components/PropertyPermissionsSelect.vue";

export default {
  name: "BusinessUserPropertyForm",
  mixins:[form, business],
  components: {
    PropertyPermissionsSelect,
    BusinessPropertySelect,
  },
  data() {
    return {
      form: {
        id: null,
        enabled: false,
        permissions: []
      }
    }
  },

  props: {
    properties: Array,
    property: Object,
    excludedProperties: Array,
  },

  methods: {
    setForm() {
      const property = this.property || {}
      this.form = {
        id: property.id || null,
        enabled: property.enabled || false,
        permissions: property.permissions || [],
      }
    },
    emitForm() {
      this.$emit('input', this.form)
    },
  }

}
</script>