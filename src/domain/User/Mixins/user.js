import {mapActions} from "vuex";
import gql from "graphql-tag";

export default {
    methods: {
        ...mapActions(['query', 'mutate']),

        getUserById(id, pending) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                      query getUserById($id: ID!, $pending: Boolean) {
                        getUserById(id: $id, pending: $pending) {
                          id
                          full_name
                          first_name
                          last_name
                          email
                          phone
                          image
                          status
                          account_type
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
                            }
                            timestamp {
                                created_at
                                updated_at
                            }
                         }
                         id_verification {
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
                    variables: { id, pending }
                })
                    .then(response => resolve(response.data.getUserById))
                    .catch(e => reject(e))
            })
        },

        saveUserIdVerification(data) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                    mutation saveUserIdVerification( $data: UserIdVerificationInput!) {
                      saveUserIdVerification(data: $data) {
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
                      }
                    }
                  `,
                    variables: { data }
                })
                .then(response => resolve(response.data.saveUserIdVerification))
                .catch(e => reject(e))
            })
        },

        saveUserAttribute( user_id, data = [], saveAsMetadata = false) {
            return new Promise((resolve, reject) => {
                this.mutate({
                    mutation: gql `
                                mutation updateUserAttribute($user_id: ID!, $data: [MetadataInput]!, $saveAsMetadata: Boolean) {
                                  updateUserAttribute(user_id: $user_id, data: $data, saveAsMetadata: $saveAsMetadata) {
                                    id
                                    metadata {
                                        key
                                        value
                                    }
                                  }
                                }
                              `,
                    variables: { user_id, data, saveAsMetadata }
                }).then(response => {
                    resolve(response.data.updateUserAttribute ? this.convertMetaKeyValueToObj(data) : {} );
                }).catch(e => reject(e))
            })
        },

        getUserNotifications(notification_ids, mark_as_read) {
            return new Promise((resolve, reject) => {
                this.query({
                    query: gql`
                    query getUserNotifications($notification_ids:[ID], $mark_as_read: Boolean){
                        getUserNotifications(notification_ids: $notification_ids, mark_as_read: $mark_as_read ){
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
                    }`,
                    variables: { notification_ids, mark_as_read }
                })
                .then(response => resolve(response.data.getUserNotifications))
                .catch(e => reject(e))
            })
        }

    }
}