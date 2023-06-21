const { ApolloServer, gql } = require('apollo-server');
const { buildSubgraphSchema } = require('@apollo/subgraph')

// Define the GraphQL schema
const typeDefs = gql`
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key", "@shareable"])

  interface Node {
    id: String!
  }

  type Query {
    node(id: String!): Node @shareable
  }

  type ExampleA implements Node @shareable {
    id: String!
    A: String!
  }
`;

// Define dummy data
const exampleAData = [
  { id: '1', A: 'Example A1' },
  { id: '2', A: 'Example A2' },
  { id: '3', A: 'Example A3' },
];

// Define the resolvers
const resolvers = {
  Node: {
    __resolveType() {
      // Resolve the interface to the specific type based on the data
      return 'ExampleA';
    },
  },
  Query: {
    node(_, { id }) {
      // Find the node by ID (for simplicity, just filtering by ID here)
      const exampleA = exampleAData.find((item) => item.id === id);
      return exampleA;
    },
  },
};

// Create an instance of ApolloServer
const schema = buildSubgraphSchema([
  {
    typeDefs,
    resolvers,
  },
]);

// Create an instance of ApolloServer
const server = new ApolloServer({
  schema,
});

// Start the server
server.listen({ port: 10000 }).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
