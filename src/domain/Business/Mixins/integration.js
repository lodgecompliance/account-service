import {mapActions} from "vuex";
import gql from "graphql-tag";

export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getBusinessIntegrationTypes() {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql `
                                query getBusinessIntegrationTypes {
                                  getBusinessIntegrationTypes {
                                    name
                                    tags
                                    identifier
                                    description
                                  }
                                }
                              `,
                }).then(response => {
                    resolve(response.data.getBusinessIntegrationTypes);
                }).catch(e => reject(e))
            })
        },

        createBusinessIntegration(business_id, data ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation createBusinessIntegration($business_id: ID!, $data: BusinessIntegrationInput!) {
                                  createBusinessIntegration(business_id: $business_id, data: $data) {
                                    id
                                    enabled
                                    title
                                    credentials
                                    settings
                                    type {
                                        name
                                        tags
                                        identifier
                                        description
                                    }
                                  }
                                }
                              `,
                    variables: { business_id, data }
                }).then(response => {
                    resolve(response.data.createBusinessIntegration);
                }).catch(e => reject(e))
            })
        },

        updateBusinessIntegration(business_id, integration_id, data ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation updateBusinessIntegration($business_id: ID!, $integration_id: ID!, $data: BusinessIntegrationInput!) {
                                  updateBusinessIntegration(business_id: $business_id, integration_id: $integration_id data: $data) {
                                    id
                                    enabled
                                    title
                                    credentials
                                    settings
                                    type {
                                        name
                                        tags
                                        identifier
                                        description
                                    }
                                  }
                                }
                              `,
                    variables: { business_id, integration_id, data }
                }).then(response => {
                    resolve(response.data.updateBusinessIntegration);
                }).catch(e => reject(e))
            })
        },

        connectBusinessStripeIntegration(business_id, integration_id, code ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation connectBusinessStripeIntegration($business_id: ID!, $integration_id: ID!, $code: String!) {
                                  connectBusinessStripeIntegration(business_id: $business_id, integration_id: $integration_id, code: $code ) {
                                    id
                                    enabled
                                    title
                                    credentials
                                  }
                                }
                              `,
                    variables: { business_id, integration_id, code }
                }).then(response => {
                    resolve(response.data.connectBusinessStripeIntegration);
                }).catch(e => reject(e))
            })
        },

        disconnectBusinessStripeIntegration(business_id, integration_id ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation disconnectBusinessStripeIntegration($business_id: ID!, $integration_id: ID! ) {
                                  disconnectBusinessStripeIntegration(business_id: $business_id, integration_id: $integration_id ) {
                                    id
                                    enabled
                                    title
                                    credentials
                                  }
                                }
                              `,
                    variables: { business_id, integration_id }
                }).then(response => {
                    resolve(response.data.disconnectBusinessStripeIntegration);
                }).catch(e => reject(e))
            })
        },

        connectBusinessMessageBirdAccountIntegration(business_id, integration_id, code ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation connectBusinessMessageBirdAccountIntegration($business_id: ID!, $integration_id: ID! ) {
                                  connectBusinessMessageBirdAccountIntegration(business_id: $business_id, integration_id: $integration_id ) {
                                    id
                                    enabled
                                    title
                                    credentials
                                  }
                                }
                              `,
                    variables: { business_id, integration_id }
                }).then(response => {
                    resolve(response.data.connectBusinessMessageBirdAccountIntegration);
                }).catch(e => reject(e))
            })
        },

        disconnectBusinessMessageBirdAccountIntegration(business_id, integration_id, code ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation disconnectBusinessMessageBirdAccountIntegration($business_id: ID!, $integration_id: ID! ) {
                                  disconnectBusinessMessageBirdAccountIntegration(business_id: $business_id, integration_id: $integration_id ) {
                                    id
                                    enabled
                                    title
                                    credentials
                                  }
                                }
                              `,
                    variables: { business_id, integration_id }
                }).then(response => {
                    resolve(response.data.disconnectBusinessMessageBirdAccountIntegration);
                }).catch(e => reject(e))
            })
        },
    }
}