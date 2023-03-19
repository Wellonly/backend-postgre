// import { AuthenticationError, UserInputError } from 'apollo-server';
import {
  decryptTextByPubKeys,
  encryptTextByPubKeys,
  expire_mS,
  getPublicKey,
  getRandomHexString, removePub,
} from '../utils/pkelib';
import { parseGraphqlRequest, log2db, logAnonimousHttp, logUserHttp, secureReturn } from '../utils/logs';
import { findAllOptions, findAllFiltered, countAllFiltered } from '../utils/ra-sequelize';
import { isAuthorizedWithRowId, isAuthorizedAsAdmin } from './authorization';
import { updateRecord, removeRecord, createRecord, readRecord } from './lib';

const userSessionsMap = new Map();

export function userSessions_maintain() {
  const dateNow = Date.now();
  let count = 0;
  userSessionsMap.forEach((v,key,) => { //check expired
    if (v.exp < dateNow) {
      deleteUserSession(key, null, 'user sessions maintain');
      count++;
    }
  });
  return `userSessions expired: ${count}`;
};

// const invalid_user_name_or_password = 'Invalid user name or password.';
const invalid_user_name_or_password_token = {token: 403};

export function getUserSession(id) {
  if (!userSessionsMap.has(id)) return null;
  return userSessionsMap.get(id);
};

const createUserToken = async (id, userSecurity, username, data) => {
  const token = encryptTextByPubKeys("".concat(username, data), userSecurity.serverPubKey, id, userSecurity.salt);
  userSecurity.token = token;
  return token;
};

const createUserSession = async (req, id, expiresIn = process.env.TOKEN_EXPIRES, saltlen = 32) => {
  const spk = getPublicKey();
  const salt = getRandomHexString(saltlen);
  const reqData = parseGraphqlRequest(req);
  userSessionsMap.set(id, {
    profile: {
      remoteAddress: reqData.remoteAddress,
      origin: reqData.origin,
      uid:null,
      username: null,
      isAdmin: false,
      iat: new Date(), /** Date type */
      exp: expire_mS(expiresIn) /** number type */
    },
    security: {
      salt,
      token:null,
      serverPubKey: spk,
    }
  });
  return spk.concat(encryptTextByPubKeys(salt, spk, id));
};

const deleteUserSession = (id, req, reason = "system") => {
  const userSecurity = getUserSession(id)?.security;
  if (userSecurity) {
    removePub(userSecurity.serverPubKey);
    userSessionsMap.delete(id);
    log2db('logout', `reason: ${reason}`, req).then(res => res);
    return true;
  }
  return false;
};

const isAdmin = (role) => (!!role && !role.indexOf('admin'));

export default {
  Query: {
    me: (parent, args, { models, me }) => {
      args.id = me.uid;
      return readRecord(me, models.User, args, isAuthorizedWithRowId);
    },
    func: async (parent, args, { models, req }) => {
      const serverPKey = await createUserSession(req, args.id);
      await log2db('user func', 'user session open request', req);
      // console.log("zv func createUserSession result:", serverPKey);
      return { token: serverPKey };
    },
    User: (parent, args, { models, me }) => {
      return readRecord(me, models.User, args, isAuthorizedWithRowId);
    },
    allUsers: (parent, args, { models, me }, info) => {
      return findAllFiltered(me, models.User, args, undefined, [['priority', 'ASC']]);
    },
    _allUsersMeta: (parent, args, { models, me }, info) => {
      return { count: countAllFiltered(me, models.User, args )};
    },
  },

  Mutation: {
    signUp: (parent, args, { models }, info) => {
      // const user = await models.User.create({ username, email, password });
      // return { token: await createUserToken(null, user, user.role) };
      return secureReturn('signUp', 'signUp activity', args, models.User) || { token: '0' }; //TODO
    },

    signIn: async (parent, { id, login, password }, { models, req }, info) => {
      const userSession = getUserSession(id);
      if (!userSession) {
        await log2db('signIn', 'user session not found', req);
        return invalid_user_name_or_password_token; // throw new AuthenticationError(invalid_user_name_or_password);
      }
      // console.log("zv userSession:", {...userSession});
      const isUpdatePass = !!userSession.security.token;
      let plainLogin = decryptTextByPubKeys(login, userSession.security.serverPubKey, id, userSession.security.salt);
      // console.log("zv credentials:", plainLogin, ppassword);
      if (!plainLogin) {
        deleteUserSession(id, req, 'login decryption error');
        return invalid_user_name_or_password_token; //throw new AuthenticationError(invalid_user_name_or_password); // throw new UserInputError( 'User not exists');
      }
      const user = await models.User.findByLogin(plainLogin);
      if (!user) {
        deleteUserSession(id, req, `user: ${plainLogin} not found`);
        return invalid_user_name_or_password_token; //throw new AuthenticationError(invalid_user_name_or_password);
      }
      const isValid = await user.validatePassword(password, userSession.security.salt);
      if (!isValid) {
        deleteUserSession(id, req, `wrong password for user: ${plainLogin}`);
        return invalid_user_name_or_password_token; //throw new AuthenticationError(invalid_user_name_or_password);
      }
      if (isUpdatePass) {
        const ticket = getRandomHexString(32);
        const token = await createUserToken(id, userSession.security, user.username, ticket);
        userSession.salt = ticket;
        return { token };
      }
      userSession.profile.uid = user.id; //zv: typeof id === 'number'
      userSession.profile.isAdmin = isAdmin(user.role);
      userSession.profile.username = user.username;
      const token = await createUserToken(id, userSession.security, user.username, "".concat(user.role,'.',user.id));
      await log2db('signIn', `session opened for user:${user.username} ${user.role}`, req);
      // console.log("zv signIn token:", token, user);
      return { token };
    },
    update: async (parent, args, { models, me, req }) => {
      if (!me) return secureReturn('update', 'no me', args, models.User);
      const { id, data } = args;
      const userSession = getUserSession(id);
      if (!userSession) {
        await log2db('update:error', `id not found: ${id}`, req);
        return invalid_user_name_or_password_token; //throw new UserInputError('session expired');
      }
      let pass = decryptTextByPubKeys(data, userSession.security.serverPubKey, id, userSession.security.salt);
      // console.log("zv update pass:", userSession.username, pass);
      if (!pass) {
        await log2db('update:error', `pass transfer fail`, req);
        return invalid_user_name_or_password_token; //throw new AuthenticationError(invalid_user_name_or_password); // throw new UserInputError( 'User not exists');
      }
      const user = await models.User.findByPk(userSession.profile.uid);
      if (!user) return ;
      await user.update({ password: await user.generatePasswordHash(pass) });
      return { token: userSession.security.token }
    },
    logout: async (parent, args, { models, req }, info) => {
      const { id } = args;
      const userProfile = getUserSession(id)?.profile;
      if (!userProfile) {
        await log2db('logout:error', `id not found: ${id}`, req);
        return invalid_user_name_or_password_token; //throw new UserInputError('session expired');
      }
      const reqData = parseGraphqlRequest(req);
      if (userProfile.origin !== reqData.origin || userProfile.remoteAddress !== reqData.remoteAddress) {
        await log2db('logout:origin error', `origin or remoteAddress not equal to user session: ${userProfile.origin}; ${userProfile.remoteAddress}`, req);
        return invalid_user_name_or_password_token; //throw new UserInputError('session expired');
      }
      const result = deleteUserSession(id, req, `request from net`);
      return { token: result ? 1: 0 };
    },
    createUser: (parent, args, { models, me }, info ) => {
      return createRecord(me, models.User, args, isAuthorizedAsAdmin);
    },
    updateUser: (parent, args, { models, me, req }, info ) => {
      return updateRecord(me, models.User, args, isAuthorizedWithRowId);
    },
    removeUser: (parent, args, { models, me, req }) => {
      return removeRecord(me, models.User, args, isAuthorizedAsAdmin);
    },
  },

  User: {
    Messages: (user, args, { models, me }) => {
      if (!me || !args.limit) return;
      return user.getMessages(findAllOptions(args, [['updatedAt', 'ASC']], user));
    },
    Folders: (user, args, { models, me }) => {
      if (!me || !args.limit) return;
      return user.getFolders(findAllOptions(args, [['priority', 'ASC']], user));
    },
  },
};

export function getMe(req) {
  const token = req.headers['auth']; // const token = req.headers['x-token'];
  if (token) {
      const user = getUserSession(token)?.profile;
      if (user) {
        logUserHttp(req, user);
        if (user.exp < Date.now()) {
          deleteUserSession(token, req, 'user session expired');
          return null;
        }
        return user;
      }
  }
  else if (process.env.isDebug) {
    const duser = {uid: -1, isAdmin: true, username: 'debug'};
    logAnonimousHttp(req, duser);
    return duser;
  }
  logAnonimousHttp(req);
  return null;
};

export function userSessionsTable() {
  const dateNow = Date.now();
  let total = userSessionsMap.size;
  let expired = 0;
  let result = '';
  userSessionsMap.forEach((v,key) => {
    const profile = v.profile;
    const expiredIn = +profile.exp - dateNow;
    if (expiredIn <= 0) expired++;
    result = result.concat(profile.uid.toString().padEnd(4).concat('|')
    , profile.username.concat(profile.isAdmin ? '+':'').padEnd(25).concat('|')
    , profile.remoteAddress.padEnd(25).concat('|')
    , profile.origin.padEnd(25).concat('|')
    , profile.iat.toISOString().padEnd(25).concat('|')
    , ''.concat(expiredIn <= 0 ? 'expired': Math.round(expiredIn/(60*1000)).toString().concat('min')).padEnd(25).concat('|')
    , '<br>'
    );
  });
  return result.concat(`Total:${total}; Expired: ${expired}`);
};
