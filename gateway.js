const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Create an ApolloGateway instance and define the subgraphs
const gateway = new ApolloGateway({
  serviceList: [
    { name: 'a', url: 'http://localhost:10000' },
    { name: 'b', url: 'http://localhost:10001' },
  ],
});

// Create an ApolloServer instance as the gateway
const server = new ApolloServer({
  gateway,
  subscriptions: false, // Disable subscriptions if not needed
});

// Start the server
server.listen().then(({ url }) => {
  console.log(`Gateway server ready at ${url}`);
});
