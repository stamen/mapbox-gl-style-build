// Helper functions for unused context
import isPlainObject from 'lodash.isplainobject';
import isEmpty from 'lodash.isempty';

export const deleteProp = (object, path) => {
  var last = path.pop();
  let next = JSON.parse(JSON.stringify(object));
  delete path.reduce((o, k) => o[k] || {}, next)[last];
  return next;
};

export const removeEmpty = o => {
  for (var k in o) {
    if (!o[k] || !isPlainObject(o[k])) {
      continue;
    }
    removeEmpty(o[k]);
    if (isEmpty(o[k])) {
      delete o[k];
    }
  }
  return o;
};
