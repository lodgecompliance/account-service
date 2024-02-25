
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";
import { onError, ErrorResponse } from "apollo-link-error";
import { InMemoryCache } from "apollo-cache-inmemory";
import gr_tokens from './graphql-tokens'
export default async (uri,onNetworkError = () => {}, onGraphQlError = () => {}) => {
    const tokens = await gr_tokens();
    // Create an http link:
    const httpLink = new HttpLink({
    uri,
    fetch,
    headers: {
        'LC-CLIENT-TOKEN': tokens.client,
        'LC-USER-TOKEN': tokens.user
      }
    });
  
    // Error Handling
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path, extensions }) => {
              console.log(
                  `[GraphQL error] ====> `, { message, locations, path, extensions }
              );
            onGraphQlError({ message, locations, path, extensions })
          }
        )
    if (networkError) {
        console.log("[Network error]--->", networkError.result)
        onNetworkError(networkError)
    }
  })

  const client = new ApolloClient({
      link: errorLink.concat(httpLink),
      cache: new InMemoryCache({
        addTypename: false
      })
    });

  return { client }
}