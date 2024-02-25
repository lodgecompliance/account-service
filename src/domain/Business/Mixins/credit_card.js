import {mapActions} from "vuex";
import gql from "graphql-tag";

export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getBusinessCreditCards(id) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                        query getBusinessById($id: ID!){
                            getBusinessById(id: $id){
                                stripe_customer {
                                    customer {
                                        id
                                        object
                                        address {
                                            city
                                            country
                                            line1
                                            line2
                                            postal_code
                                            state
                                        }
                                        balance
                                        created
                                        currency
                                        description
                                        email
                                        livemode                                    
                                        name
                                        phone
                                        default_source
                                    }
                                    sources {
                                        has_more
                                        data {
                                            id
                                            name
                                            brand
                                            exp_month
                                            exp_year
                                            last4
                                            customer
                                        }
                                    }
                                }
                            }
                        }`,
                    variables: { id }
                })
                .then(response => resolve(response.data.getBusinessById?.stripe_customer))
                .catch(e => reject(e))
            })
        },

        createBusinessAsStripeCustomer(business_id, source) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql`
                    mutation createBusinessAsStripeCustomer($business_id: ID!, $source: ID!){
                        createBusinessAsStripeCustomer(business_id: $business_id, source: $source){
                            customer {
                                id
                                object
                                address {
                                    city
                                    country
                                    line1
                                    line2
                                    postal_code
                                    state
                                }
                                balance
                                created
                                currency
                                description
                                email
                                livemode
                                metadata {
                                    property_id
                                    user_id
                                }
                                name
                                phone
                            }
                            sources {
                                has_more
                                data {
                                    id
                                    name
                                    brand
                                    exp_month
                                    exp_year
                                    last4
                                    customer
                                }
                            }
                        }
                    }
                `,
                    variables: { business_id, source }
                })
                .then(response => resolve(response.data.createBusinessAsStripeCustomer))
                .catch(e => reject(e))
            })
        },

        addBusinessCreditCard(business_id, source) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql`
                    mutation addBusinessCreditCard($business_id: ID!, $source: ID!){
                        addBusinessCreditCard(business_id: $business_id, source: $source){
                            id
                            name
                            object
                            brand
                            exp_month
                            exp_year
                            last4
                            customer
                        }
                    }
                `, variables: { business_id, source }
                })
                .then(response => resolve(response.data.addBusinessCreditCard))
                .catch(e => reject(e))
            })
        },

        removeBusinessCreditCard(business_id, card_id) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql`
                    mutation removeBusinessCreditCard($business_id: ID!, $card_id: ID!){
                        removeBusinessCreditCard(business_id: $business_id, card_id: $card_id)
                    }
                `,
                variables: { business_id, card_id }
                })
                .then(response => resolve(response.data.removeBusinessCreditCard))
                .catch(e => reject(e))
            })
        }
    }
}