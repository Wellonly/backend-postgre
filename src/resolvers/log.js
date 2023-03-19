import Sequelize from 'sequelize';

import { isAuthorizedAsAdmin } from './authorization';
import { pubsub, EVENTS } from '../subscription';
import { logError } from '../utils/logs';
import { createRecord, readRecord } from './lib';

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string =>
  Buffer.from(string, 'base64').toString('ascii');

export default {
  Query: {
    Log: (parent, args, { models, me }) => {
      return readRecord(me, models.Log, args, isAuthorizedAsAdmin);
    },
    logs: async (parent, { cursor, limit = 20 }, { models, me }) => {
      if (!me) return;
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};

      const logs = await models.Log.findAll({
        order: [['createdAt', 'DESC']],
        limit: limit + 1,
        ...cursorOptions,
      });

      const hasNextPage = logs.length > limit;
      const edges = hasNextPage ? logs.slice(0, -1) : logs;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(
            edges[edges.length - 1].createdAt.toString(),
          ),
        },
      };
    },
  },

  Mutation: {
    createLog: (parent, args, { models, req, me }, info) => {
      return createRecord(me, models.Log, args).then(log => {
        // console.log('..zv: Mutation: createLog publish event:', log);
        pubsub.publish(EVENTS.LOG.CREATED, { logCreated: log });
        return { token: log && log.id };
      }).catch(err => {
        logError(err, 'createLog', args, models.Log);
        return null;
      });
    },
  },

  // Log: {
  //   user: async (log, args, { models, me }) => {
  //     if (!me) return;
  //     return models.User.findOne({
  //       where: {
  //         id: log.user_id,
  //       },
  //     });
  //   },
  // },

  Subscription: {
    logCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.LOG.CREATED),
    },
  },
};
