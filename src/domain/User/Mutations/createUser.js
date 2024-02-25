import gql from 'graphql-tag'

export default gql`
    mutation createUser($user_id: ID, $data: UserInput!) {
        createUser(user_id: $user_id, data: $data) {
            id
        }
    }`