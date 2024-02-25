<template>
   <integration-setup
       :open="open"
       title="API Setup"
       :fetch-query="getQuery"
       @close="open = false"
   >
       <clip-board v-model="api.key" />
     <template #actions>
       <v-btn class="mx-2" :loading="saving" @click="generateApiKey" color="primary" depressed>
         <v-icon>mdi-refresh</v-icon>  Generate key
       </v-btn>
     </template>
   </integration-setup>
</template>

<script>
import gql from 'graphql-tag';
import ClipBoard from '@/components/Utilities/ClipBoard.vue';
import IntegrationSetup from "@/domain/Business/Widgets/Setup.vue";

export default {
    name: "ApiIntegration",
    components: {
      IntegrationSetup, ClipBoard,
    },
    props: {
      business: Object,
      credentials: Object
    },
    data(){
        return {
            open: false,
            getQuery: {},
            api:{},
            saving: false
        }
    },

    methods: {
      credentialsFetched(response) {
          this.api = response.getPropertyIntegrations.api
      },
      generateApiKey() {
        this.saving = true;
        this.$store.dispatch('mutate', {
            mutation: gql`
                mutation generatePropertyApiKey($property_id: ID!){
                    generatePropertyApiKey(property_id: $property_id) {
                        key
                    }
                }
            `,
            variables: {
                property_id: this.property.id,
            }
        })
        .then(response => {
            this.api = response.data.generatePropertyApiKey;
            this.$store.commit("SNACKBAR", {
                status: true,
                text: "API key generated",
                color: "success"
            });
            this.$emit('updated');
        })
        .catch(e => {
            this.$store.commit('TOAST_ERROR', {
                show: true,
                message: `Failed. `,
                retry: () => this.generateApiKey(),
                exception: e
            })
        })
        .finally(() => {
            this.saving = false;
        })
      },
    },

    watch: {
      property: {
        immediate: true,
        handler(property) {
          if(!property) this.getQuery = null;
          this.getQuery = {
            query: gql`
              query getPropertyIntegrations($property_id: ID!){
                getPropertyIntegrations(property_id: $property_id){
                  api {
                      key
                     }
                  }
                }`,
                variables: {
                  property_id: property.id
                }
          };
        }
      }
    }
}
</script>