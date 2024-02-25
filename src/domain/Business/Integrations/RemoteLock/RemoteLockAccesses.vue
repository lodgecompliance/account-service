<template>
  <v-card flat>
      <v-card-text>
          <error-handler :error="error" @retry="getAccesses" />
          <data-container :loading="loading">
              <v-list v-if="items.length" class="mt-5">
                  <v-list-item
                  v-for="access in items" :key="access.id" >
                      <v-list-item-content>
                          <v-list-item-title>{{ access.attributes.name }}</v-list-item-title>
                          <v-list-item-subtitle>Status: {{ access.attributes.status }}</v-list-item-subtitle>
                      </v-list-item-content>
                  </v-list-item>
              </v-list>
              <div v-else class="py-5 text-center grey--text">
                  No access
              </div>
          </data-container>
      </v-card-text>
  </v-card>
</template>

<script>
import gql from 'graphql-tag';
import DataContainer from '../../../../components/DataContainer.vue';
import ErrorHandler from "@/components/ErrorHandler.vue";

export default
  {
    name: "RemoteLockAccesses",
    components: {ErrorHandler, DataContainer },
    data(){
        return {
            loading: false,
            accesses: null,
            error: null
        }
    },
    props: {
        property: Object,
    },

    computed: {
        items() {
            return this.accesses && this.accesses.data ? this.accesses.data : [];
        },
    },
    methods: {
        getAccesses(){
            this.loading = true;
            this.error = null;
            this.$store.dispatch('query', {
                query: gql`
                    query getPropertyRemotelockAccesses($property_id: ID!) {
                        getPropertyRemotelockAccesses(property_id: $property_id) {
                            data {
                                id
                                type
                                attributes {
                                    name
                                    email
                                    phone
                                    department
                                    status
                                    source
                                    guest_source
                                    created_at
                                    updated_at
                                    pin
                                    card_number
                                }
                            }
                        }
                    }`,
                variables: {
                    property_id: this.property.id
                }
            })
            .then(response => {
                this.accesses = response.data.getPropertyRemotelockAccesses
            })
            .catch(e => {
                this.error = e
            })
            .finally(() => {
                this.loading = false;
            })
        },
        
    },

    mounted() {
      this.getAccesses()
    }
  }
</script>