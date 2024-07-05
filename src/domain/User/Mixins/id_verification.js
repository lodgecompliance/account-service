import {mapActions} from "vuex";
import gql from "graphql-tag";

const stripeFields = `
id
object
created
last_error {
    code
    reason
}
livemode
metadata {
    user_id  
}
options{
    document {
        document_types
        require_id_number
        require_live_capture
        require_matching_selfie
    } 
}
status
type
url
client_secret
last_verification_report {
    id
    object
    created
    livemode
    type
    options {
        document {
            document_types
            require_id_number
            require_live_capture
            require_matching_selfie
        } 
    }
    document {
        status
        error {
            code
            reason
        }
        first_name
        last_name
        dob {
            year
            month
            day
        }
        address {
            line1
            city
            state
            zip
            country
        }
        back
        front
        expiration_date {
            year
            month
            day
        }
        issued_date {
            year
            month
            day
        }
        issuing_country
    }
    selfie {
        document_front
        error {
            code
            reason
        }
        selfie
        status
    }
    metadata {
        user_id
    }
    files{
        document_front {
            img_src
        }
        document_back{
            img_src
        }
        selfie {
            img_src
        }
    }
}
verified
`;
const smileFields = `
ResultCode
ResultText
Actions {
  Liveness_Check
  Register_Selfie
  Selfie_Provided
  Verify_ID_Number
  Human_Review_Compare
  Return_Personal_Info
  Selfie_To_ID_Card_Compare
  Human_Review_Update_Selfie
  Human_Review_Liveness_Check
  Selfie_To_ID_Authority_Compare
  Update_Registered_Selfie_On_File
  Selfie_To_Registered_Selfie_Compare
}
verified
`
export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getUserVerification(user_id) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                      query getUserById($id: ID!) {
                        getUserById(id: $id) {
                            id_verification {
                                country
                                provider
                                manually_completed
                                first_name
                                last_name
                                id_type
                                id_image
                                id_number
                                stripe {
                                    ${stripeFields}
                                }
                                smile {
                                    ${smileFields}
                                }
                            }
                        }
                      }
                    `,
                    variables: { id: user_id }
                })
                    .then(response => resolve(response.data.getUserById?.id_verification))
                    .catch(e => reject(e))
            })
        },

        getUserStripeVerifications(user_id) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                      query getUserById($id: ID!) {
                        getUserById(id: $id) {
                            stripe_verifications {
                                ${stripeFields}
                            }
                        }
                      }
                    `,
                    variables: { id: user_id }
                })
                    .then(response => resolve(response.data.getUserById?.stripe_verifications))
                    .catch(e => reject(e))
            })
        },

        getUserStripeVerification(user_id, verification_id) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                      query getUserStripeVerification($user_id: ID!, $verification_id: ID!) {
                        getUserStripeVerification(user_id: $user_id, verification_id: $verification_id) {
                          ${stripeFields}
                        }
                      }
                    `,
                    variables: { user_id, verification_id }
                })
                    .then(response => resolve(response.data.getUserStripeVerification))
                    .catch(e => reject(e))
            })
        },

        createUserStripeVerification(user_id, metadata, return_url, refresh_url ) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation createUserStripeVerificationSession($user_id: ID!, $metadata: MetadataInput, $return_url: String, $refresh_url: String ) {
                      createUserStripeVerificationSession(user_id: $user_id, metadata: $metadata, return_url: $return_url, refresh_url: $refresh_url ) {
                        ${stripeFields}
                      }
                    }
                  `,
                    variables: { user_id, metadata, return_url, refresh_url }
                })
                .then(response => resolve(response.data.createUserStripeVerificationSession))
                .catch(e => reject(e))
            })
        },

    }
}