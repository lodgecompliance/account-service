import gql from 'graphql-tag';

export default gql`
    query getAuthUser {
        getAuthUser {
            id
            email
            phone
            first_name
            last_name
            full_name
            image
            status
            account_type
            wallet_account_id
            id_verification {
                user_id
                first_name
                last_name
                country
                id_type
                id_number
                id_image
                timestamp {
                    created_at
                    updated_at
                }
                stripe {
                    id
                    status
                    type
                    url
                    client_secret
                }
                smile {
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
                }
            }
            notifications {
                id
                type
                title
                text
                time
                timestamp
                read
                read_at
                metadata {
                    key
                    value
                }
            }
            businesses {
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
                    status
                    owner {
                        user {
                            id
                            first_name
                            last_name
                            image
                        }
                    }
                    properties {
                        id
                        name
                        image
                        email
                        address
                    }
                    wallet_account_id
                }
            }     
        }
    }`;