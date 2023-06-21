# Demo of Apollo federation composition issues when using the Relay `Node` interface

This repo attempts to illustrate an issue using Apollo federation in conjunction with Graphql sub-graphs that independently implement [the `Node` interface/`node` query as part of the common Relay spec](https://relay.dev/graphql/objectidentification.htm).

To see this in action, you can run the three servers like so:

```shell
npm i
# run the two demonstration sub-graphs in the background:
node servera.js &
node serverb.js &
# run the demonstration gateway:
node gateway.js
```

Both sub-graph "A" and "B" servers here implement the `@shareable` interface for concrete GraphQL entity types and the `node` query, when you run the gateway server it responds with this error on startup:

```
Error: A valid schema couldn't be composed. The following composition errors were found:
	For the following supergraph API query:
{
  node(id: "A string value") {
    ...
  }
}
Shared field "Query.node" return type "Node" has a non-intersecting set of possible runtime types across subgraphs. Runtime types in subgraphs are:
 - in subgraph "a", type "ExampleA";
 - in subgraph "b", type "ExampleB".
This is not allowed as shared fields must resolve the same way in all subgraphs, and that imply at least some common runtime types between the subgraphs.
    at IntrospectAndCompose.createSupergraphFromSubgraphList (/node_modules/@apollo/gateway/dist/supergraphManagers/IntrospectAndCompose/index.js:73:19)
    at IntrospectAndCompose.updateSupergraphSdl (/node_modules/@apollo/gateway/dist/supergraphManagers/IntrospectAndCompose/index.js:65:36)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async IntrospectAndCompose.initialize (/node_modules/@apollo/gateway/dist/supergraphManagers/IntrospectAndCompose/index.js:28:36)
    at async ApolloGateway.initializeSupergraphManager (/node_modules/@apollo/gateway/dist/index.js:299:28)
    at async ApolloGateway.load (/node_modules/@apollo/gateway/dist/index.js:253:13)
    at async SchemaManager.start (/node_modules/apollo-server-core/dist/utils/schemaManager.js:42:28)
    at async ApolloServer._start (/node_modules/apollo-server-core/dist/ApolloServer.js:195:30)
    at async ApolloServer.listen (/node_modules/apollo-server/dist/index.js:71:9)
```

I'm not 100% confident there's some federation directive I'm missing which would make this type of composition work? But I'm sharing this example in the event that this is a fundamental constraint of Apollo federation.
