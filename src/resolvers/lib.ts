import { assignWith } from "lodash";
import Sequelize from "sequelize";
import { logError, log2db, secureReturn } from "../utils/logs";

import { imageSaver } from '../utils/lib';
import { isAuthorized } from './authorization';

/**
 * manageImages() transform images field from array to string and save images to fs
 * @param args
 * @param field name
 * */
export function manageImages(args = {}, field = "images") { //transform images...
  if (Array.isArray(args[field])) {
    args[field] = args[field].reduce((acc, v) => {
      imageSaver({...v});
      return acc.concat(acc ? ',':'', v.name);
    },"");
  }
}

export function checkImages(me, row, args): boolean {
  manageImages(args, 'images');
  return true;
}

export function checkImagesAndArtImages(me, row, args): boolean {
  ['images', 'artimages'].forEach(v => manageImages(args, v));
  return true;
}

export interface RecordCB {
  (me: object, row: typeof Sequelize.Model, args:object): boolean | object;
}

export interface AsyncCB {
  (me: object, row: typeof Sequelize.Model, args:object): Promise<boolean>;
}

/**
 * 
 * @param me 
 * @param model 
 * @param args 
 * @param cb params:(me, row, args) if specified then it must returns boolean or object that controls return vakue
 * @returns the cb object or if !empty then record, empty: undefined (with no auth log)
 */
export function readRecord(me, model, args, cb?: RecordCB, opname: string = 'read') {
  if (!isAuthorized(me)) return secureReturn(opname, 'no me', args, model);
  const id = args?.id;
  if (!id) return secureReturn(opname, 'No such id', args, model);
  return model.findByPk(id).then(record => {
    if (!record) return secureReturn(opname, 'No such id', args, model);
    if (cb) {
      const cbresult = cb(me, record, args);
      if (typeof cbresult === 'object') return cbresult;
      if (!cbresult) return secureReturn(opname, 'no auth', args, model);
    }
    return record;
  }).catch(err => {
    logError(err, opname, args, model);
    return null;
  });
};

/**
 * 
 * @param me 
 * @param model 
 * @param args 
 * @param cb params:(me, row, args) if specified then it must returns a boolean that controls: to be update(true) or not(false) the record
 * @param opname
 */
export function updateRecord(me, model, args, cb?: RecordCB, opname: string = 'update') {
  return readRecord(me, model, args, cb, opname).then(record => {
    if (record) {
      const oldv = assignWith({}, args, (ov,sv,key) => (key && record[key]) || null);
      return record.update(args).then(result => {
        const newv = Object.keys(args).map(v => (oldv.hasOwnProperty(v) && oldv[v] != args[v]) ? v: '');
        log2db(opname, `values:\nold: ${JSON.stringify(oldv)};\nnew: ${JSON.stringify(args, newv)}`);
        return result;
      }).catch(err => {
        logError(err, opname, args, model);
        return null;
      });
    }
    return record;
  }).catch(err => null);
};

export function updateRow(row, args, opname: string = 'updateRow') {
    if (row) {
      const oldv = assignWith({}, args, (ov,sv,key) => (key && row[key]) || null);
      return row.update(args).then(result => {
        const newv = Object.keys(args).map(v => (oldv.hasOwnProperty(v) && oldv[v] != args[v]) ? v: '');
        log2db(opname, `values:\nold: ${JSON.stringify(oldv)};\nnew: ${JSON.stringify(args, newv)}`);
        return result;
      }).catch(err => {
        logError(err, opname, args);
        return null;
      });
    }
    return false;
};

/**
 * 
 * @param me 
 * @param model 
 * @param args 
 * @param cb params:(me, row, args) if specified then it must returns a boolean that controls: to be update(true) or not(false) the record
 * @param opname
 */
export async function createRecord(me, model, args, cb?: RecordCB, opname: string = 'create') {
  if (!isAuthorized(me)) return secureReturn(opname, 'no me', args, model);
  if (cb && !cb(me, model, args)) return secureReturn(opname, 'no auth', args, model);
  return model.create({ ...args }).then(result => {
    log2db(opname, `new values: ${JSON.stringify(args)}`);
    return result;
  }).catch(err => {
    logError(err, opname, args, model);
    return null;
  });
};

/**
 * 
 * @param me 
 * @param model 
 * @param args 
 * @param cb params:(me, row, args) if specified then it must returns a boolean that controls: to be removed(true) or not(false) the record
 * @param opname?
 */
export function removeRecord(me, model, args, cb?: RecordCB, opname: string = 'remove') {
  return !!readRecord(me, model, args, cb, opname).then(record => {
    // console.log('..zv: removeRecord record', record);
    if (record) {
      if (record.donotremove) return !!record.donotremove;
      return record.destroy().then(result => {
        log2db(opname, `old values: ${JSON.stringify(record)}`);
        return true;
      }).catch(err => {
        logError(err, opname, args, model);
        return false;
      });
    }
    return false;
  }).catch(() => false);
};

export enum ArgsCode {
  ARGS_CODE_UNDEFINED = 0,
  ARGS_CODE_OK = 1,
  ARGS_CODE_FAIL = 2,
}

/**
 * Mutate the args by add(write) excode_ property with ARGS_CODE_FAIL
 * @param args 
 * @returns false
 */
export function argsFilterFail(args): boolean {
  args.filter.excode_ = ArgsCode.ARGS_CODE_FAIL;
  return false;
}

/**
 * Mutate the args by add(write) excode_ property with ARGS_CODE_FAIL
 * @param args 
 * @returns false
 */
export function argsFilterReject(args, reason?: string): Promise<any> {
  args.filter.excode_ = ArgsCode.ARGS_CODE_FAIL;
  return Promise.reject(reason);
}

/**
 * Mutate the args by add(write) excode_ property with ARGS_CODE_OK
 * @param args 
 * @returns true
 */
export function argsFilterSuccess(args): boolean {
  args.filter.excode_ = ArgsCode.ARGS_CODE_OK;
  return true;
}

export function argsFilterCode(args): ArgsCode {
  return args?.filter?.excode_ || ArgsCode.ARGS_CODE_UNDEFINED;
}
