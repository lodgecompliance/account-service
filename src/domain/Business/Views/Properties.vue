<template>
  <business-profile-page>
    <v-row
        justify="space-between"
        class="mb-3"
    >
      <v-col cols="8">
        <search-field v-model="search" />
      </v-col>
      <v-col cols="4" class="text-right">
        <business-property-dialog
            :business="currentBusiness"
            :activator="{ color: 'primary', depressed: true }"
            @property-created="propertyCreated"
        >
          <v-icon>mdi-plus</v-icon> <span v-show="$vuetify.breakpoint.smAndUp">Add New</span>
        </business-property-dialog>
      </v-col>
    </v-row>
    <business-properties :search="search" :business="currentBusiness" ref="properties" />
  </business-profile-page>
</template>

<script>
    import current_business from "@/domain/Business/Mixins/current_business";
    import BusinessProfilePage from "@/domain/Business/Views/Profile.vue";
    import business from "@/domain/Business/Mixins/business";
    import BusinessProperties from "@/domain/Business/Widgets/BusinessProperties.vue";
    import SearchField from "@/components/Search.vue";
    import BusinessPropertyDialog from "@/domain/Business/Widgets/PropertyDialog.vue";

    export default {
      name: "BusinessPropertiesPage",
      mixins:[current_business, business],
      components: {
        BusinessPropertyDialog,
        SearchField,
        BusinessProperties,
        BusinessProfilePage,
      },
      data() {
        return {
          search: null,
          property: null
        }
      },
      methods: {
        propertyCreated(property) {
          this.$refs.properties.propertyCreated(property);
        }
      },
    }
</script>


