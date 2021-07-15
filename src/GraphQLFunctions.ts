import { gql, GraphQLClient } from 'graphql-request';

export const getQuery = function (str: string): any {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';
  const query = gql`
    ${str}
  `;
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const graph = client.request(query).then((data) => {
    return data;
  });
  return graph;
};

export const doMutation = function (str: string) {
  const endpoint = 'https://dev.graphql-v2.keix.com/graphql';
  // ... or create a GraphQL client instance to send requests
  const client = new GraphQLClient(endpoint, { headers: {} });
  const mutation = gql`
    ${str}
  `;
  const graph = client.request(mutation).then((data) => {
    return data;
  });
  return graph;
};
