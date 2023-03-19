const objectRef = (obj, str) => {
  const levels = str.split('.');
  for (var i = 0; i < levels.length; i++) {
    obj = obj[levels[i]];
  }
  return obj;
}
module.exports.objectRef = objectRef;

const forEachAsync = async (array, callback) => {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array);
  }
}
module.exports.forEachAsync = forEachAsync;
