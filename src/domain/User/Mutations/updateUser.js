import gql from 'graphql-tag'

export default gql`
    mutation updateUser($user_id: ID!, $data: UserInput!) {
        updateUser(user_id: $user_id, data: $data) {
            id
        }
    }`