require('dotenv').config();
if (process.env.NODE_ENV) {
  process.env.isDebug = process.env.NODE_ENV;
}
import cors from 'cors';
import morgan from 'morgan'; //HTTP request logger middleware for node.js
import { createServer as createServerHttp } from 'http';
import { createServer as createServerHttps } from 'https';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import { schemas } from './schema';
import { resolvers } from './resolvers';
import { models, sequelize } from './models';
import { seedDB } from './seed/seeddb';
import { resolve } from 'path';

import { logWithPrefix, updateLastHttpRequest, log2db } from './utils/logs';
import { readFileSyncSafe } from './utils/lib';
import { maintenance_init } from './utils/maintenance';
import { getMe, getUserSession } from './resolvers/user';
import {tests} from './debug';

if (!Reflect.has(process.env, 'DATABASE_SCHEMA')) throw new Error('\n..zv: env file error');

process.env.mediaFolder = process.env.MEDIA_FOLD || 'images';
process.env.mediaFolderAbsolutePath = resolve(__dirname, '../'.concat(process.env.mediaFolder));

if (process.env.isDebug) console.log('..zv app process.env: ', process.env);

const app = express();

app.use(cors());

app.use(express.static(process.env.mediaFolder)); // use subdirs instead... app.use('/img', express.static('images'));

app.use(morgan('dev', { // HTTP request logger middleware for node.js
  skip: (req, res) => {
    return res.statusCode === 200
  },
}));

const apollo = new ApolloServer({
  introspection: true,
  playground: true,
  typeDefs: schemas,
  resolvers,
  formatError: error => {
    const message = error.message;
    const body = error.source && error.source.body;

    log2db('Apollo:error', `${message}`).then(result => result);

    if (process.env.isDebug) {
      console.log("\n..zv Apollo error:", message, body);
      return {...error, message }; //send full details!!!
    }
    return { message };
  },
  context: async (ctx) => { //expressjs vars: req, res, connection
    const { req, connection } = ctx;
    if (connection) { //exist when a subscription from a client executed(connected), no req(res) passed
      console.log("..zv on subscription:", connection.operationName, connection.variables, connection.context/*, {...connection} */);
      updateLastHttpRequest(connection);
      return {
        models,
        connection,
      };
    }

    if (req) { //exist when a query received from a client, no connection passed
      const me = await getMe(req);
      const uid = me && me.uid;
      updateLastHttpRequest(req, uid);
      //excluded, generate too much logs:  if (!uid) log2db('AppolloServer', 'no me auth');
      return {
        models,
        me,
        req,
      };
    }
  },
  subscriptions: {
    path: '/subs',
    // keepAlive?: number;
    onConnect: (connectionParams, webSocket, context) => { /* webSocket available as: context.socket */
      const user = connectionParams.auth ? getUserSession(connectionParams.auth)?.profile: null;
      // console.log('..zv subscriptions: onConnect:', connectionParams, user, context?.socket?.protocol /* , context */);
      if (user) {
        log2db('onConnect subscriptions ok', `${user.uid}:${user.username}`, null, user.uid);
        return user; //returns connectionContext
      }  
      log2db('onConnect subscriptions fail', `bad auth:${connectionParams.auth}`, null, null);
      throw new Error('Bad auth token!');
    },
    onDisconnect: (webSocket, context) => { /* webSocket available as: context.socket */
      // console.log('..zv subscriptions: onDisconnect:', context?.initPromise/* , context */);
      context?.initPromise && context.initPromise.then(user => {
        if (typeof user === 'object') log2db('onDisconnect subscriptions ok', `${user.uid}:${user.username}`, null, user.uid);
      });
    },
  },
});

const bodyParserLimit = process.env.BODY_PARSER_LIMIT || '20mb';
apollo.applyMiddleware({ app, path: '/graphql', bodyParserConfig: { limit: bodyParserLimit }});

const transportConfig = process.env.isDebug ? {
  ssl: false, 
  port: process.env.PORT || 8000,
  hostname: 'localhost'
}: {
  ssl: true,
  port: 443,
  hostname: process.env.HOSTNAME
};

const server = transportConfig.ssl 
  ? createServerHttps({
      key: readFileSyncSafe(process.env.PEM_KEY),
      cert: readFileSyncSafe(process.env.PEM_CERT)
    }, app)
  : createServerHttp(app);

apollo.installSubscriptionHandlers(server);

app.use(function (req, res, next) {
  res.status(404).send(`<h2>Sorry, can't find that. Feel lucky: ${transportConfig.hostname} </h2>`);
});

const isTest = !!process.env.TEST_DATABASE;
const isSeedDB = process.env.NODE_ENV === 'seed';

const syncOptions = {
  force: isTest || isSeedDB,
  logging: (data) => {
    logWithPrefix("zv db sync:", data);
  },
};

sequelize.sync(syncOptions).then(() => {
  if (syncOptions.force) {
    seedDB(new Date());
  }
  server.listen(transportConfig, () => {
    const basepath = ''.concat(transportConfig.hostname, ':', transportConfig.port);
    console.log('Apollo Server: '.concat(transportConfig.ssl ? 'https://': 'http://', basepath, apollo.graphqlPath));
    console.log('Subscriptions: '.concat(transportConfig.ssl ? 'wss://':     'ws://', basepath, apollo.subscriptionsPath));
  });
}).catch(err => {
  throw new Error(`..zv db sync error: ${err?.message}`);
});

maintenance_init();

if (process.env.isDebug) {
  tests();
}