import { GraphQLClient } from 'graphql-request';

import { SubscriptionClient } from 'subscriptions-transport-ws';
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import gql from 'graphql-tag';
import { getMainDefinition } from '@apollo/client/utilities';

const GRAPHQL_ENDPOINT = 'https://dev.graphql-v2.keix.com/graphql';

export const getQuery = function (str: string): any {
  const query = gql`
    ${str}
  `;
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(GRAPHQL_ENDPOINT, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data;
  });
  return graph;
};

export const doMutation = function (str: string): any {
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(GRAPHQL_ENDPOINT, { headers: {} });
  const mutation = gql`
    ${str}
  `;
  const graph = client.request(mutation).then((data) => {
    return data;
  });
  return graph;
};

export const getSubscribe = function (stringa: string): any {
  const GRAPHQL_ENDPOINT2 = 'wss://dev.graphql-v2.keix.com/graphql';

  const httpLink = new HttpLink({
    uri: 'http://dev.graphql-v2.keix.com/graphql',
  });

  const wsLink = new WebSocketLink({
    uri: GRAPHQL_ENDPOINT2,
    options: {
      reconnect: true,
    },
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  const clientApollo = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
  });

  const graph = clientApollo
    .subscribe({
      query: gql`
        subscription($id: String!) {
          subscribeForEvents(id: $id) {
            id
            stream_name
            type
            time
            position
            global_position
            data
          }
        }
      `,
      variables: { id: stringa },
    })
    .subscribe({
      next(data) {
        console.log(data.data.subscribeForEvents);
        return data.data.subscribeForEvents;
      },
      error(err) {
        console.error('err', err);
      },
    });
  return graph;
};

/* gql`
        subscription($id: String!) {
          subscribeForEvents(id: $id) {
            id
            stream_name
            type
            time
            position
            global_position
            data
          }
        }
      `,
      variables: { id: stringa }, */
