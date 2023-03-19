const { imageSaver } = require('../utils/lib');

/**
 * manageImages() transform images field from array to string and save images to fs
 * @param args
 * @param field name
 * */
module.exports.manageImages = function manageImages(args = {}, field = "images") { //transform images...
  if (Array.isArray(args[field])) {
    args[field] = args[field].reduce((acc, v) => {
                                  imageSaver({...v});
                                  return acc.concat(acc ? ',':'', v.name);
                                },"");
  }

  return
}