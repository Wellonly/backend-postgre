const Sequelize = require('sequelize');

const {gt, gte, lt, lte, in: opIn, ne, or} = Sequelize.Op;

export function filter2where (filter = {}, modelName = null) {
  // console.log('\n..zv: filter2where:', filter);
  if (typeof filter !== 'object') return null;
  if (filter.ids) {
    return { id: { [opIn]: filter.ids }};
  } else if (filter.q) {
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
      } else { //for equals
        where[key] = filter[key];
      }
    });
    return where;
  }
};

export function findAllOptions({ page, perPage, sortField, sortOrder, limit, filter}, defaultSortOrder = null, modelName = null) {
  return {
    offset: isNaN(page*perPage) ? null: page*perPage,
    limit: isNaN(+perPage) ? (isNaN(+limit) ? null: +limit): +perPage,
    where: filter2where(filter, modelName),
    order: (sortField && typeof sortField === "string" && sortField.length <= 15) ? [[sortField, sortOrder ? sortOrder: 'ASC']]: defaultSortOrder,
  };
};

export function findAllFiltered(model, args, defaultSortOrder = null) {
  const modelName = model.getTableName().name;
  return model.findAll(findAllOptions({ ...args }, defaultSortOrder, modelName ));
};

export function countAllFiltered(model, args) {
  const { /*page, perPage,*/ filter } = args;
  const modelName = model.getTableName().name;
  return model.count({where: filter2where(filter, modelName)});
};

