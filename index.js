import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import passport from 'passport';
import session from 'express-session';
import connectMongo from 'connect-mongodb-session';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { buildContext } from 'graphql-passport';
import mergedResolvers from './resolvers/index.js';
import mergedTypeDefs from './typeDefs/index.js';
import { connectDB } from './db/connectDB.js';

// Import Passport config function
import { configurePassport } from './config/passport.js';

dotenv.config();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);
const isProduction = process.env.NODE_ENV === 'production';

// Configure session store
const MongoDBStore = connectMongo(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
});

store.on('error', (err) => {
  console.error('Session store error:', err);
});

// Configure Passport
configurePassport();

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Create Apollo Server with production-only introspection
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  introspection: isProduction,
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return isProduction ? { message: 'Internal server error' } : error;
  },
});

// Start the server
const startServer = async () => {
  try {
    await server.start();

    // Apply middleware without CORS restrictions
    app.use(
      '/graphql',
      express.json(),
      expressMiddleware(server, {
        context: async ({ req, res }) => ({
          ...buildContext({ req, res }),
          req,
          res,
          isProduction,
        }),
      })
    );

    // Add a middleware to block introspection queries in non-production
    if (!isProduction) {
      app.use('/graphql', (req, res, next) => {
        const query = req.body.query || '';
        if (query.includes('__schema') || query.includes('__type')) {
          return res.status(403).json({
            errors: [
              {
                message:
                  'GraphQL introspection is disabled in development environment',
              },
            ],
          });
        }
        next();
      });
    }

    // Connect to MongoDB and start server
    await connectDB();
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

    console.log(`🚀 Server ready at http://localhost:4000/graphql`);
    console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);
    console.log(`Introspection: ${isProduction ? 'Enabled' : 'Disabled'}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
