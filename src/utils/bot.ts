import fs from 'fs';

import { /* log2db,  logError,*/ errorToString } from './logs';
import { Message } from '../types';
import { sendMessage } from '../resolvers/message';
import { BOT_UID } from '../resolvers/authorization';
import { PLACE } from '../seed/commonFolders';
import { userSessionsTable } from '../resolvers/user';

export async function bottask(messageModel) {
  const message: Message = messageModel.dataValues;
  const model = messageModel.sequelize.models.message;
  // const {message, model} : {message: Message, model: any} = args;
  const start = new Date();
  console.log('..zv: bot dotask:', message, model);
  let botError;
  let botText;
  try {
    const cmd = message.title;
    if (cmd.startsWith('backup')) {
      console.log('..zv TODO: bot start backup:', start);

    }
    else if (cmd.startsWith('users')) { //active users list...
      botText = userSessionsTable();
    }
    else {
      throw new Error(`Unknown command: ${cmd}`);
    }
  } catch (err) {
    botError = err;
    botText = errorToString(err); //  logError(err, 'bottask:error', message);
  }

  if (!model) return;
  if (message.user_id === BOT_UID) return; //to prevent endless loop!
  //finally answer...
  const answer = {
    user_id: BOT_UID,
    folder_id: PLACE.outbox,
    to_id: message.user_id,
    inbox_id: PLACE.inbox,
    sentAt: new Date(),
    title: `bot ${botError ? 'sad': 'ok'}: ${message.title}; id: ${message.id}`,
    text: botText,
  };
  sendMessage({uid: BOT_UID}, model, answer);
}