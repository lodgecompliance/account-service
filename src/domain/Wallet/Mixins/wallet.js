import {mapActions} from "vuex";
import gql from "graphql-tag";
import config from "@/config";

const WALLET = `
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
}
parent_entity {
    id
}
metadata {
    key
    value
}
connection
timestamp {
    created_at
    updated_at
}
`
const ACCOUNT = `
id
type
metadata {
    key
    value
}
integrations {
    stripe
    paystack
    revolut
}
wallets {
  ${WALLET}  
}
`
export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getAccount(id) {
            return new Promise((resolve, reject) => {
                this.query({
                    domain: config.apollo.wallet,
                    query: gql`
                    query getEntity($entity_id: ID!) {
                        getEntity(entity_id: $entity_id) {
                            ${ACCOUNT}
                        }
                    }
                    `,
                    variables: { entity_id: id }
                })
                .then(response => resolve(response.data.getEntity))
                .catch(e => reject(e))
            })
        },

        createAccount(type, metadata) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    domain: config.apollo.wallet,
                    mutation: gql`
                    mutation createEntity($type: String!, $metadata: [MetadataInput]) {
                        createEntity(type: $type, metadata: $metadata) {
                            ${ACCOUNT}
                        }
                    }
                    `,
                    variables: { type, metadata }
                })
                .then(response => resolve(response.data.createEntity))
                .catch(e => reject(e))
            })
        },

        createAccountWallet(entity_id, wallet_type, parent_entity_id) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    domain: config.apollo.wallet,
                    mutation: gql`
                    mutation createEntityWallet ($entity_id: ID!, $wallet_type: String!, $parent_entity_id: ID, ) {
                        createEntityWallet(entity_id: $entity_id, wallet_type: $wallet_type, parent_entity_id: $parent_entity_id) {
                            ${WALLET}
                        }
                    }
                    `,
                    variables: { entity_id, wallet_type, parent_entity_id }
                })
                .then(response => resolve(response.data.createEntityWallet))
                .catch(e => reject(e))
            })
        },

        setAccountIntegration(entity_id, integrations) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    domain: config.apollo.wallet,
                    mutation: gql`
                    mutation setEntityIntegrations($entity_id: ID!, $integrations: EntityIntegrationsInput) {
                        setEntityIntegrations(entity_id: $entity_id, integrations: $integrations) {
                            id
                            integrations {
                                stripe
                                paystack
                                revolut
                            }
                        }
                    }
                    `,
                    variables: { entity_id, integrations }
                })
                .then(response => resolve(response.data.setEntityIntegrations))
                .catch(e => reject(e))
            })
        },

        connectNgnWallet(entity_id, wallet_id, account_details) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    domain: config.apollo.wallet,
                    mutation: gql`
                    mutation connectEntityNgnWallet ($entity_id: ID!, $wallet_id: ID!, $account_details: PaystackNubanInput!) {
                        connectEntityNgnWallet(entity_id: $entity_id, wallet_id: $wallet_id, account_details: $account_details) {
                            ${WALLET}
                        }
                    }
                    `,
                    variables: { entity_id, wallet_id, account_details }
                })
                .then(response => resolve(response.data.connectEntityNgnWallet))
                .catch(e => reject(e))
            })
        },

        disconnectNgnWallet(entity_id, wallet_id) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    domain: config.apollo.wallet,
                    mutation: gql`
                    mutation disconnectEntityNgnWallet ($entity_id: ID!, $wallet_id: ID!) {
                        disconnectEntityNgnWallet(entity_id: $entity_id, wallet_id: $wallet_id) {
                            ${WALLET}
                        }
                    }
                    `,
                    variables: { entity_id, wallet_id }
                })
                .then(response => resolve(response.data.disconnectEntityNgnWallet))
                .catch(e => reject(e))
            })
        },
    }
}