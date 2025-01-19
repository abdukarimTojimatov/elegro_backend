import express from 'express';
import http from 'http';
import cors from 'cors';
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

// Request logging middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, originalUrl, body, headers } = req;

  console.log('\n🔍 New Request -----------------------------');
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`📍 Endpoint: ${method} ${originalUrl}`);
  console.log('🔒 Headers:', {
    origin: headers.origin,
    'content-type': headers['content-type'],
    authorization: headers.authorization ? 'Present' : 'None',
  });

  if (body.query) {
    console.log('📝 GraphQL Query:', body.query.replace(/\s+/g, ' ').trim());
    if (body.variables) {
      console.log('🔧 Variables:', JSON.stringify(body.variables, null, 2));
    }
  }

  console.log('--------------------------------------------\n');

  // Add response logging
  const oldSend = res.send;
  res.send = function (data) {
    console.log(
      '📤 Response:',
      data.substring(0, 200) + (data.length > 200 ? '...' : '')
    );
    console.log('--------------------------------------------\n');
    oldSend.apply(res, arguments);
  };

  next();
};

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
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      requestDidStart: async (requestContext) => {
        return {
          willSendResponse: async (requestContext) => {
            console.log(
              '🏁 Operation completed:',
              requestContext.operationName || 'Anonymous Operation'
            );
          },
        };
      },
    },
  ],
  introspection: isProduction,
  formatError: (error) => {
    console.error('❌ GraphQL Error:', error);
    return isProduction ? { message: 'Internal server error' } : error;
  },
});

// Start the server
const startServer = async () => {
  try {
    await server.start();

    const frontendOrigin = isProduction
      ? 'http://91.108.122.60:3002'
      : 'http://localhost:3002';

    // Apply middleware
    app.use(
      '/graphql',
      requestLogger, // Add request logging middleware
      cors({
        origin: [frontendOrigin],
        credentials: true,
      }),
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
          console.log('🚫 Blocked introspection query in development');
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

    console.log(`\n🚀 Server ready at http://localhost:4000/graphql`);
    console.log(
      `🌍 Environment: ${isProduction ? 'Production' : 'Development'}`
    );
    console.log(`🔍 Introspection: ${isProduction ? 'Enabled' : 'Disabled'}\n`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
