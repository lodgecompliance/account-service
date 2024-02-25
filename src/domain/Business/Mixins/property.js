import {mapActions} from "vuex";
import gql from "graphql-tag";
import config from "@/config";

export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getPropertyPermissions() {
            return new Promise((resolve, reject) => {
                this.query({
                    domain: config.apollo.gr,
                    query: gql`
                      query getPropertyPermissions {
                        getPropertyPermissions {
                            reservation {
                                id
                                label
                                description
                            }
                            property {
                                id
                                label
                                description
                            }
                           }
                        }
                    `
                })
                    .then(response => resolve(response.data.getPropertyPermissions))
                    .catch(e => reject(e))
            })
        },

        createBusinessProperty(business_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation createBusinessProperty($business_id: ID!, $data: BusinessPropertyInput!) {
                      createBusinessProperty(business_id: $business_id, data: $data) {
                          id
                          name
                          email
                          phone
                          address
                          rules
                          term_url
                          status
                          integrations {
                            key
                            value
                          }
                          metadata {
                            key
                            value
                          }
                          timestamp {
                            created_at
                            updated_at
                          }
                      }
                    }
                  `,
                    variables: { business_id, data  }
                })
                .then(response => resolve(response.data.createBusinessProperty))
                .catch(e => reject(e))
            })
        },

        updateBusinessProperty(business_id, property_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation updateBusinessProperty($business_id: ID!, $property_id: ID!, $data: BusinessPropertyInput!) {
                      updateBusinessProperty(business_id: $business_id, property_id: $property_id, data: $data) {
                          id
                          name
                          email
                          phone
                          address
                          rules
                          term_url
                          status
                          integrations {
                            key
                            value
                          }
                          metadata {
                            key
                            value
                          }
                          timestamp {
                            created_at
                            updated_at
                          }
                      }
                    }
                  `,
                    variables: { business_id, property_id, data }
                })
                .then(response => resolve(response.data.updateBusinessProperty))
                .catch(e => reject(e))
            })
        },

        createBusinessPropertyUser(business_id, business_user_id, property_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation createBusinessPropertyUser($business_id: ID!, $business_user_id, $property_id: ID!, $data: BusinessPropertyUserInput! ){
                        createBusinessPropertyUser(business_id: $business_id, business_user_id: $business_user_id, property_id: $property_id, data: $data){
                            id
                            role
                            enabled
                            permissions                            
                        }
                    }
                  `,
                    variables: { business_id, property_id, data }
                })
                .then(response => resolve(response.data.createBusinessPropertyUser))
                .catch(e => reject(e))
            })
        },

        updateBusinessPropertyUser(business_id, business_user_id, property_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                mutation: gql `
                    mutation updateBusinessPropertyUser($business_id: ID!, $business_user_id: ID!, $property_id: ID!, $data: BusinessPropertyUserInput! ){
                        updateBusinessPropertyUser(business_id: $business_id, business_user_id: $business_user_id, property_id: $property_id, data: $data){
                            id
                            role
                            enabled
                            permissions          
                        }
                    }
                  `,
                variables: { business_id, business_user_id, property_id, data }
                })
                .then(response => resolve(response.data.updateBusinessPropertyUser))
                .catch(e => reject(e))
            })
        },

        removeBusinessPropertyUser(business_id, business_user_id, property_id) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation removeBusinessPropertyUser($business_id: ID!, business_user_id: ID!, $property_id: ID!){
                        removeBusinessPropertyUser(business_id: $business_id, business_user_id: $business_user_id, property_id: $property_id)
                    }
                  `,
                    variables: { business_id, business_user_id, property_id }
                })
                .then(response => resolve(response.data.removeBusinessPropertyUser))
                .catch(e => reject(e))
            })
        }

    }
}