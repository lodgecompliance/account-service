import {mapActions} from "vuex";
import gql from "graphql-tag";

export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getBusinessById(id, fields = `
                          id
                          name
                          status
                          address
                          country
                          rc_number
                          document
                          wallet_account {
                              id
                              wallets {
                                id  
                                amount
                                suspended
                                blocked
                                available
                                status
                                type {
                                  id
                                  name
                                  currency
                                  colors
                                  currency_symbol
                                }
                                connection
                                timestamp {
                                    created_at
                                    updated_at
                                }
                              }
                          }                        
                          users {
                            id
                            user {
                                id
                                first_name
                                last_name
                                full_name
                                email
                                phone
                                account_type
                                status
                                image
                            }
                          }
                          timestamp {
                              created_at
                              updated_at
                          }`) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                      query getBusinessById( $id: ID! ){
                        getBusinessById( id: $id ) {
                          ${fields}
                        }
                      }
                    `,
                    variables: { id }
                })
                .then(response => resolve(response.data.getBusinessById))
                .catch(e => reject(e))
            })
        },

        createBusiness(data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation createBusiness($data: BusinessInput!) {
                      createBusiness(data: $data) {
                        id
                        role
                        status
                        permissions
                        business {
                          id
                          name
                          address
                          country
                          rc_number
                          document
                          owner {
                            user {
                                id
                                first_name
                                last_name,
                                image
                            }
                          }
                          timestamp {
                            created_at
                            updated_at
                          }
                        }
                      }
                    }
                  `,
                    variables: { data  }
                })
                .then(response => resolve(response.data.createBusiness))
                .catch(e => reject(e))
            })
        },

        updateBusiness(business_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation updateBusiness($business_id: ID!, $data: BusinessInput!) {
                      updateBusiness(business_id: $business_id, data: $data) {
                        id
                        name
                        address
                        country
                        rc_number
                        document
                        timestamp {
                          created_at
                          updated_at
                        }
                      }
                    }
                  `,
                    variables: { business_id,  data }
                })
                .then(response => resolve(response.data.updateBusiness))
                .catch(e => reject(e))
            })
        },

        saveBusinessAttribute(business_id, data = [], saveAsMetadata = false) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation updateBusinessAttribute($business_id: ID!, $data: [MetadataInput]!, $saveAsMetadata: Boolean) {
                                  updateBusinessAttribute(business_id: $business_id, data: $data, saveAsMetadata: $saveAsMetadata) {
                                    id
                                    metadata {
                                        key
                                        value
                                    }
                                  }
                                }
                              `,
                    variables: { business_id, data, saveAsMetadata }
                }).then(response => {
                    resolve(response.data.updateBusinessAttribute ? this.convertMetaKeyValueToObj(data) : {} );
                }).catch(e => reject(e))
            })
        },

        createBusinessUser(business_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation createBusinessUser($business_id: ID!, $data: BusinessUserInput! ){
                        createBusinessUser(business_id: $business_id, data: $data){
                            id
                            role
                            email
                            status
                            permissions
                            invite_url 
                            properties {
                                id
                                enabled
                                permissions
                           }                      
                        }
                    }
                  `,
                    variables: { business_id, data }
                })
                    .then(response => resolve(response.data.createBusinessUser))
                    .catch(e => reject(e))
            })
        },

        updateBusinessUser(business_id, business_user_id, data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation updateBusinessUser($business_id: ID!, $business_user_id: ID!, $data: BusinessUserInput! ){
                        updateBusinessUser(business_id: $business_id, business_user_id: $business_user_id, data: $data){
                            id
                            role
                            email
                            status
                            permissions
                            invite_url   
                            properties {
                                id
                                enabled
                                permissions
                           }
                        }
                    }
                  `,
                    variables: { business_id, business_user_id, data }
                })
                .then(response => resolve(response.data.updateBusinessUser))
                .catch(e => reject(e))
            })
        },

        removeBusinessUser(business_id, business_user_id) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation removeBusinessUser($business_id: ID!, business_user_id: ID!){
                        removeBusinessUser(business_id: $business_id, business_user_id: $business_user_id)
                    }
                  `,
                    variables: { business_id, business_user_id }
                })
                .then(response => resolve(response.data.removeBusinessUser))
                .catch(e => reject(e))
            })
        }
    }
}