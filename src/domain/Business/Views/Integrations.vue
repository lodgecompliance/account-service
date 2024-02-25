<template>

  <business-profile-page>
    <div class="d-flex justify-end">
      <business-integration-dialog
          :business="currentBusiness"
          :activator="{ depressed: true, color: 'primary' }"
          @integration-created="integrationCreated"
      >
        <v-icon>mdi-plus</v-icon> <span v-show="$vuetify.breakpoint.smAndUp">Add New</span>
      </business-integration-dialog>
    </div>
    <data-container :loading="loading">
      <business-integrations
          :business="{ ...currentBusiness, integrations }"
      />
    </data-container>
  </business-profile-page>

</template>

<script>
    import current_business from "@/domain/Business/Mixins/current_business";
    import DataContainer from "@/components/DataContainer.vue";
    import BusinessIntegrations from "@/domain/Business/Widgets/BusinessIntegrations.vue";
    import BusinessProfilePage from "@/domain/Business/Views/Profile.vue";
    import business from "@/domain/Business/Mixins/business";
    import BusinessIntegrationDialog from "@/domain/Business/Widgets/PropertyIntegrationDialog.vue";

    export default {
      name: "BusinessIntegrationsPage",
      mixins:[current_business, business],
      components: {
        BusinessIntegrationDialog,
        BusinessProfilePage,
        BusinessIntegrations,
        DataContainer,
      },
      data() {
        return {
          loading: false,
          integrations: []
        }
      },
      methods: {
        integrationCreated(integration) {
          this.integrations.unshift(integration)
        },
        getBusinessIntegrations() {
          this.loading = true;
          this.getBusinessById(this.currentBusiness.id, `
              integrations {
                  id
                  enabled
                  title
                  credentials
                  settings
                  ref
                  type {
                      name
                      tags
                      identifier
                      description
                  }
                }
            `)
          .then(business => {
            this.integrations = (business?.integrations || [])
          }).finally(() => this.loading = false)
        }
      },

      mounted() {
          this.getBusinessIntegrations();
      }
    }
</script>


