import Sequelize from 'sequelize';
import { RecordCB, AsyncCB } from '../resolvers/lib';
import { isAuthorized } from '../resolvers/authorization';
import { secureReturn } from './logs';

const {gt, gte, lt, lte, in: opIn, ne, or} = Sequelize.Op;

export interface Filter {
  [key: string]: any;
}

export function filter2where(filter: Filter = {}, model?: any) {
  // console.log('\n..zv: filter2where:', filter);
  if (typeof filter !== 'object') return null;
  if (filter.ids) {
    return { id: { [opIn]: filter.ids }};
  } else if (filter.q) {
    const tabname = model ? model.getTableName(): '';
    const modelName = typeof tabname === 'string' ? tabname: tabname.name;
    return Sequelize.literal(`${modelName}::text LIKE '%${filter.q}%'`); //ex.: select * from customers as customer where customer::text LIKE '%text%'
  } else {
    let where = {};
    Object.keys(filter).forEach(key => {
      if (key.endsWith('_gte')) {
        const realKey = key.replace(/(_gte)$/, '');
        where[realKey] = { [gte]: filter[key] };
      } else if (key.endsWith('_lte')) {
        const realKey = key.replace(/(_lte)$/, '');
        where[realKey] = { [lte]: filter[key] };
      } else if (key.endsWith('_lt')) {
        const realKey = key.replace(/(_lt)$/, '');
        where[realKey] = { [lt]: filter[key] };
      } else if (key.endsWith('_gt')) {
        const realKey = key.replace(/(_gt)$/, '');
        where[realKey] = { [gt]: filter[key] };
      } else if (key.endsWith('_ne')) {
        const realKey = key.replace(/(_ne)$/, '');
        where[realKey] = { [ne]: filter[key] };
      } else if (key.endsWith('_or')) {
        const realKey = key.replace(/(_or)$/, '');
        if (Array.isArray(filter[key])) where[realKey] = { [or]: filter[key] };
      } else if (key.endsWith('_')) {
        //zv: it's mutate flag, just exclude it from filter
      } else { //for equals
        where[key] = filter[key];
      }
    });
    Object.getOwnPropertySymbols(filter).forEach(sym => {
      where[sym] = Reflect.get(filter, sym);
    });
    return where;
  }
};

export interface FindOptions {
  page?: number; 
  perPage?: number;
  sortField?: string; 
  sortOrder?: string; 
  limit?: number; 
  filter?: Filter;
}

export function findAllOptions({ page = NaN, perPage = NaN, sortField, sortOrder, limit = NaN, filter}: FindOptions, defaultSortOrder?: [[string, string]], model?: any) {
  return {
    offset: isNaN(page*perPage) ? null: page*perPage,
    limit: isNaN(+perPage) ? (isNaN(+limit) ? null: +limit): +perPage,
    where: filter2where(filter, model),
    order: (sortField && typeof sortField === "string" && sortField.length <= 15) ? [[sortField, sortOrder ? sortOrder: 'ASC']]: defaultSortOrder,
  };
};

export function findAllFilteredAsync(me, model, args: FindOptions, cb: AsyncCB, defaultSortOrder?: [[string, string]], opname: string = 'readAll') {
  if (!isAuthorized(me)) return secureReturn(opname, 'no me', args, model) || [];
  return cb(me, model, args).then(result => {
    return result ? model.findAll(findAllOptions(args, defaultSortOrder, model )) || []
                  : secureReturn(opname, 'no auth', args, model) || [];
  }).catch(err => secureReturn(opname, `asyncCB:${err}`, args, model) || []);
};

//NOTE: we cannot realize findAndCountAll instead findAllFiltered & countAllFiltered because this is a different queries: a count of page and a total count
export function findAllFiltered(me, model, args: FindOptions, cb?: RecordCB, defaultSortOrder?: [[string, string]], opname: string = 'readAll') {
  if (!isAuthorized(me)) return secureReturn(opname, 'no me', args, model) || [];
  if (cb && !cb(me, model, args)) return secureReturn(opname, 'no auth', args, model) || [];
  return model.findAll(findAllOptions(args, defaultSortOrder, model )) || [];
};

export function countAllFiltered(me, model, args: Filter, cb?: RecordCB, opname: string = 'metaCount') {
  if (!isAuthorized(me)) return secureReturn(opname, 'no me', args, model) || 0;
  if (cb && !cb(me, model, args)) return secureReturn(opname, 'no auth', args, model) || 0;
  return model.count({where: filter2where(args.filter, model)}) || 0;
};

export function getSchemaAndTableName(model) {
  const tabname = model.getTableName();
  const schema = typeof tabname === 'string' ? 'noschema' : tabname.schema;
  const name = typeof tabname === 'string' ? tabname : tabname.name;
  return `${schema}.${name}`;
}