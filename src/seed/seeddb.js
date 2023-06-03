import {models, sequelize } from '../models/index';
import {seedUsers} from './user';
import shortDb from './radata-short';
import citiesDb from './citiesdb';
import {sleep} from '../utils/lib';

let errLog = [];

export function createSchemaIfNotExist(schema, autorization = 'postgres') {
const query = `CREATE SCHEMA IF NOT EXISTS ${schema} AUTHORIZATION ${autorization}`;
  sequelize.query(query).then(([res,meta]) => {
    // console.log("..zv: createSchemaIfNotExist() seems ok");
  }).catch(err => {
    throw new Error(`\n..zv createSchemaIfNotExist() error: ${err.message}`);
  });
}

const setSequenceCounter = async (schema, tableName, value = 0) => {
  const query = `select pg_catalog.setval('${schema}.${tableName}_id_seq', ${value}, TRUE)`;
  await sequelize.query(query)
    .then(([res,meta]) => {
      // console.log("zv sql ok:", query, '; result:', { ...res[0] });
    })
    .catch(err => {
      const errmess = `\n..zv set sequence counter error: ${err.message}`;
      errLog.push(errmess);
      throw new Error(errmess);
    });
};

export async function seedDB(date) {
  // process.setUncaughtExceptionCaptureCallback(err => {
  //   console.log('\n..zv: process UncaughtException:', err);
  // });

  errLog = [];
  const dbLog = ['User'];
  seedUsers(date);
  
  dbLog.push(seedData(citiesDb));
  dbLog.push(seedData(shortDb));

  await sleep(500);
  const resultDbLog = dbLog.flat();
  console.log('\n..zv dbLog:', resultDbLog.length, resultDbLog);
  console.log('\n..zv: seedDB() error count:', errLog.length, errLog);
};

function seedData(data) {
  if (typeof data !== 'object' || Object.keys(data).length === 0) {
    errLog.push(`\n..zv seed input data bad`);
  }
  Object.keys(data).map((key) => {
    if (models.hasOwnProperty(key)) {
      bulkCreator(data, key);
    }
    else {
      errLog.push(`\n..zv seed: model not found: ${key}`);
    }
  });
  console.log('..zv: seed:', Object.keys(data).length, Object.keys(data));
  return Object.keys(data);
}

async function bulkCreator(data, key) {
  await sleep(300);
  await models[key].bulkCreate(data[key], {
    validate: true,
  }).then(async res => {
    const recsTotal = data[key].length;
    const names = models[key].getTableName();
    await sleep(100*recsTotal);
    await setSequenceCounter(names.schema, names.tableName, recsTotal);
    console.log("\n..zv seed ok for:", key, res.length, "of", recsTotal);
  }).catch(err => {
    errLog.push(`\n..zv: seed error for:" ${key}; message: ${err.message}`);
  });
}
