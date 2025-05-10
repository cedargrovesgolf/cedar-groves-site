const NodeCache = require('node-cache');

const cache = new NodeCache({ 
  stdTTL: 86400, 
  checkperiod: 600 
});


function resetCache() {
  cache.flushAll();
}

module.exports = {
  cache,
  resetCache
};