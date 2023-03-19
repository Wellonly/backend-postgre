// import { ForbiddenError } from 'apollo-server';
// import { combineResolvers, skip } from 'graphql-resolvers';
const { secureReturn } = require('../utils/logs');

const isAuthorizedId = (me, id = 0) => {
  const uid = me.uid || 0;
  return (!!uid && (me.isAdmin || id === uid));
};
module.exports.isAuthorizedId = isAuthorizedId;

const isAuthorizedIds = (me, id = 0, id2 = 0) => {
  const uid = me.uid || 0;
  return (!!uid && (me.isAdmin || id === uid || id2 === uid));
};
module.exports.isAuthorizedIds = isAuthorizedIds;

module.exports.isAuthorizedWithRowId = (me, row) => isAuthorizedId(me, row.id);
module.exports.isAuthorizedWithRowUserId = (me, row) => isAuthorizedId(me, row.user_id);

/*
module.exports.isAuthenticated = (parent, args, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated as user.');

module.exports.isAdmin = combineResolvers(
  isAuthenticated,
  (parent, args, { me: { role } }) =>
    role === 'ADMIN'
      ? skip
      : new ForbiddenError('Not authorized as admin.'),
);

module.exports.isMessageOwner = async (parent, { id }, { models, me }, info) => {
  const message = await models.Message.findByPk(id, { raw: true });

  if (message.user_id !== me.uid) {
    throw new ForbiddenError('Not authenticated as owner.');
  }

  return skip;
};

*/