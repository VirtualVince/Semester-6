require('dotenv').config();

const express      = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const http         = require('http');
const cors         = require('cors');
const bodyParser   = require('body-parser');
const { graphqlUploadExpress } = require('graphql-upload');

const connectDB    = require('./config/db');
const typeDefs     = require('./schema/typeDefs');
const resolvers    = require('./schema/resolvers');
const { verifyToken } = require('./middleware/auth');

const PORT = process.env.PORT || 4000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  const app        = express();
  const httpServer = http.createServer(app);

  // Apollo Server v4
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (formattedError) => {
      // Return a clean error object to the client
      return {
        message: formattedError.message,
        code: formattedError.extensions?.code || 'INTERNAL_SERVER_ERROR',
      };
    },
  });

  await server.start();

  app.use(cors());
  app.use(graphqlUploadExpress({ maxFileSize: 10_000_000, maxFiles: 1 }));

  app.use(
    '/graphql',
    bodyParser.json(),
    expressMiddleware(server, {
      // Attach decoded user (if any) to every request's context
      context: async ({ req }) => {
        const decoded = verifyToken(req);
        return { user: decoded };
      },
    })
  );

  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));

  console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  console.log(`📊 GraphQL Sandbox / GraphiQL: http://localhost:${PORT}/graphql`);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
